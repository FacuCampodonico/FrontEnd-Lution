import { useCallback, useEffect, useRef, useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { errorMessage } from "@/lib/errors"
import { cerrarMesa, getMesa } from "@/services/mesas.service"
import { confirmarPagoMercadoPago, createPago, crearPreferenciaMercadoPago } from "@/services/pagos.service"
import { getPedidoPorMesa } from "@/services/pedidos.service"
import type { Mesa } from "@/types/mesa"
import type { Pedido } from "@/types/pedido"
import type { MetodoPagoManual, PagoRegistrado, RetornoMercadoPago } from "@/types/pago"

export function usePago(mesaId: string) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [mesa, setMesa] = useState<Mesa | null>(null)
  const [pago, setPago] = useState<PagoRegistrado | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const action = useAsyncAction()
  const { clearError } = action
  const currentMesaId = useRef(mesaId)
  currentMesaId.current = mesaId

  const refetch = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    clearError()
    try {
      const [mesaData, pedidoData] = await Promise.all([getMesa(mesaId), getPedidoPorMesa(mesaId)])
      if (currentMesaId.current !== mesaId) return
      setMesa(mesaData)
      setPedido(pedidoData)
    } catch (cause) {
      if (currentMesaId.current === mesaId) setLoadError(errorMessage(cause))
    } finally {
      if (currentMesaId.current === mesaId) setLoading(false)
    }
  }, [mesaId, clearError])

  useEffect(() => {
    setMesa(null)
    setPedido(null)
    setPago(null)
    void refetch()
  }, [refetch])

  // Cobrar libera la mesa en el back. Solo las mesas cobradas con el flujo anterior quedan en por_pagar.
  const pendienteDeLiberar = pago === null && mesa?.estado === "por_pagar"
  const puedeCobrar = !loading && !loadError && !action.pending && pago === null && pedido !== null && pedido.estado === "abierto"

  async function cobrar(metodo: MetodoPagoManual, pagaCon?: number) {
    if (!puedeCobrar || !pedido) return false
    return action.run(async () => {
      let registrado: PagoRegistrado
      try {
        registrado = await createPago({ pedidoId: pedido.id, metodo, pagaCon })
      } catch (cause) {
        await refetch()
        throw cause
      }
      if (currentMesaId.current !== mesaId) return
      setPago(registrado)
      setPedido(null)
    })
  }

  async function pagarConMercadoPago() {
    if (!puedeCobrar || !pedido) return false
    return action.run(async () => {
      const preferencia = await crearPreferenciaMercadoPago(pedido.id)
      window.location.assign(preferencia.checkoutUrl)
    })
  }

  // El checkout vuelve a esta pantalla; el back verifica el pago contra Mercado Pago antes de cerrar el pedido.
  async function confirmarMercadoPago(retorno: RetornoMercadoPago) {
    return action.run(async () => {
      if (!retorno.paymentId || retorno.paymentId === "null") {
        throw new Error(`El pago con Mercado Pago no se completó${retorno.status && retorno.status !== "null" ? ` (${retorno.status})` : ""}. Podés intentar de nuevo.`)
      }
      let registrado: PagoRegistrado
      try {
        registrado = await confirmarPagoMercadoPago(retorno.pedidoId, retorno.paymentId)
      } catch (cause) {
        await refetch()
        throw cause
      }
      if (currentMesaId.current !== mesaId) return
      setPago(registrado)
      setPedido(null)
    })
  }

  async function liberar() {
    if (!pendienteDeLiberar || action.pending) return false
    return action.run(async () => { await cerrarMesa(mesaId) })
  }

  return { mesa, pedido, pago, loading, pending: action.pending, error: loadError ?? action.error, puedeCobrar, pendienteDeLiberar, cobrar, pagarConMercadoPago, confirmarMercadoPago, liberar, refetch }
}
