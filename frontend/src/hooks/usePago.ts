import { useCallback, useEffect, useRef, useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { errorMessage } from "@/lib/errors"
import { closeTable, getTable } from "@/services/mesas.service"
import { cancelMercadoPagoCharge, createPayment, createMercadoPagoPreference, getMercadoPagoChargeStatus } from "@/services/pagos.service"
import { getOrderByTable } from "@/services/pedidos.service"
import type { Table } from "@/types/mesa"
import type { Order } from "@/types/pedido"
import type { ManualPaymentMethod, RegisteredPayment, MercadoPagoPreference } from "@/types/pago"

/** How often the backend is asked whether the customer already paid the QR. */
const STATUS_INTERVAL_MS = 3000

export function usePago(tableId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [table, setTable] = useState<Table | null>(null)
  const [payment, setPayment] = useState<RegisteredPayment | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [qr, setQr] = useState<MercadoPagoPreference | null>(null)
  const [qrNotice, setQrNotice] = useState<string | null>(null)
  const action = useAsyncAction()
  const { clearError } = action
  const currentTableId = useRef(tableId)
  currentTableId.current = tableId

  const refetch = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    clearError()
    try {
      const [tableData, orderData] = await Promise.all([getTable(tableId), getOrderByTable(tableId)])
      if (currentTableId.current !== tableId) return
      setTable(tableData)
      setOrder(orderData)
    } catch (cause) {
      if (currentTableId.current === tableId) setLoadError(errorMessage(cause))
    } finally {
      if (currentTableId.current === tableId) setLoading(false)
    }
  }, [tableId, clearError])

  useEffect(() => {
    setTable(null)
    setOrder(null)
    setPayment(null)
    setQr(null)
    setQrNotice(null)
    void refetch()
  }, [refetch])

  // There is a live Mercado Pago QR (on screen or after a reload): wait for the customer to pay.
  const awaitingCharge = payment === null && order !== null && (qr !== null || order.cobroMercadoPagoPendiente)
  const orderId = order?.id

  useEffect(() => {
    if (!awaitingCharge || !orderId) return
    let active = true
    const checkStatus = async () => {
      try {
        const status = await getMercadoPagoChargeStatus(orderId)
        if (!active || currentTableId.current !== tableId) return
        if (status.estado === "pagado") {
          setPayment({ message: "Pago con Mercado Pago registrado con éxito", pedidoId: orderId, total: status.total ?? 0, vuelto: 0 })
          setOrder(null)
          setQr(null)
        } else if (status.estado === "sin_cobro") {
          setQr(null)
          setQrNotice("El QR venció sin que el cliente pague. Podés generar uno nuevo.")
          void refetch()
        }
      } catch {
        // Temporary failure (network or Mercado Pago): retried on the next tick.
      }
    }
    const timer = window.setInterval(() => { void checkStatus() }, STATUS_INTERVAL_MS)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [awaitingCharge, orderId, tableId, refetch])

  // Charging frees the table in the backend. Only tables charged with the old flow stay in por_pagar.
  const pendingRelease = payment === null && table?.estado === "por_pagar"
  const canCharge = !loading && !loadError && !action.pending && payment === null && order !== null && order.estado === "abierto" && !awaitingCharge

  async function charge(method: ManualPaymentMethod, cashReceived?: number) {
    if (!canCharge || !order) return false
    return action.run(async () => {
      let registered: RegisteredPayment
      try {
        registered = await createPayment({ pedidoId: order.id, method, pagaCon: cashReceived })
      } catch (cause) {
        await refetch()
        throw cause
      }
      if (currentTableId.current !== tableId) return
      setPayment(registered)
      setOrder(null)
    })
  }

  // Generates the QR (or a new one if there was one): the customer pays from their phone and the screen finds out on its own.
  async function generateQr() {
    if (loading || loadError || action.pending || payment !== null || !order || order.estado !== "abierto") return false
    setQrNotice(null)
    return action.run(async () => {
      const preference = await createMercadoPagoPreference(order.id)
      if (currentTableId.current !== tableId) return
      setQr(preference)
      setOrder({ ...order, cobroMercadoPagoPendiente: true })
    })
  }

  async function cancelQr() {
    if (!order || action.pending) return false
    return action.run(async () => {
      try {
        await cancelMercadoPagoCharge(order.id)
      } finally {
        // If the customer managed to pay, the backend answers 409: the refetch shows the order already closed.
        await refetch()
      }
      if (currentTableId.current !== tableId) return
      setQr(null)
    })
  }

  async function release() {
    if (!pendingRelease || action.pending) return false
    return action.run(async () => { await closeTable(tableId) })
  }

  return { table, order, payment, loading, pending: action.pending, error: loadError ?? action.error, notice: qrNotice, canCharge, pendingRelease, qr, awaitingCharge, charge, generateQr, cancelQr, release, refetch }
}
