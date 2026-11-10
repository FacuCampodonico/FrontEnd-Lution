import { useCallback, useEffect, useRef, useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { errorMessage } from "@/lib/errors"
import { cerrarMesa, getMesa } from "@/services/mesas.service"
import { cancelarCobroMercadoPago, createPago, crearPreferenciaMercadoPago, getEstadoCobroMercadoPago } from "@/services/pagos.service"
import { getPedidoPorMesa } from "@/services/pedidos.service"
import type { Mesa } from "@/types/mesa"
import type { Pedido } from "@/types/pedido"
import type { MetodoPagoManual, PagoRegistrado, PreferenciaMercadoPago } from "@/types/pago"

/** Cada cuánto se le pregunta al back si el cliente ya pagó el QR. */
const INTERVALO_ESTADO_MS = 3000

export function usePago(mesaId: string) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [mesa, setMesa] = useState<Mesa | null>(null)
  const [pago, setPago] = useState<PagoRegistrado | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [qr, setQr] = useState<PreferenciaMercadoPago | null>(null)
  const [avisoQr, setAvisoQr] = useState<string | null>(null)
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
    setQr(null)
    setAvisoQr(null)
    void refetch()
  }, [refetch])

  // Hay un QR de Mercado Pago vigente (en pantalla o recién recargada): se espera a que el cliente pague.
  const esperandoCobro = pago === null && pedido !== null && (qr !== null || pedido.cobroMercadoPagoPendiente)
  const pedidoId = pedido?.id

  useEffect(() => {
    if (!esperandoCobro || !pedidoId) return
    let activo = true
    const consultar = async () => {
      try {
        const estado = await getEstadoCobroMercadoPago(pedidoId)
        if (!activo || currentMesaId.current !== mesaId) return
        if (estado.estado === "pagado") {
          setPago({ message: "Pago con Mercado Pago registrado con éxito", pedidoId, total: estado.total ?? 0, vuelto: 0 })
          setPedido(null)
          setQr(null)
        } else if (estado.estado === "sin_cobro") {
          setQr(null)
          setAvisoQr("El QR venció sin que el cliente pague. Podés generar uno nuevo.")
          void refetch()
        }
      } catch {
        // Falla momentánea (red o Mercado Pago): se reintenta en el próximo ciclo.
      }
    }
    const timer = window.setInterval(() => { void consultar() }, INTERVALO_ESTADO_MS)
    return () => {
      activo = false
      window.clearInterval(timer)
    }
  }, [esperandoCobro, pedidoId, mesaId, refetch])

  // Cobrar libera la mesa en el back. Solo las mesas cobradas con el flujo anterior quedan en por_pagar.
  const pendienteDeLiberar = pago === null && mesa?.estado === "por_pagar"
  const puedeCobrar = !loading && !loadError && !action.pending && pago === null && pedido !== null && pedido.estado === "abierto" && !esperandoCobro

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

  // Genera el QR (o uno nuevo si ya había): el cliente paga desde su celular y la pantalla se entera sola.
  async function generarQr() {
    if (loading || loadError || action.pending || pago !== null || !pedido || pedido.estado !== "abierto") return false
    setAvisoQr(null)
    return action.run(async () => {
      const preferencia = await crearPreferenciaMercadoPago(pedido.id)
      if (currentMesaId.current !== mesaId) return
      setQr(preferencia)
      setPedido({ ...pedido, cobroMercadoPagoPendiente: true })
    })
  }

  async function cancelarQr() {
    if (!pedido || action.pending) return false
    return action.run(async () => {
      try {
        await cancelarCobroMercadoPago(pedido.id)
      } finally {
        // Si el cliente alcanzó a pagar, el back responde 409: el refetch muestra el pedido ya cerrado.
        await refetch()
      }
      if (currentMesaId.current !== mesaId) return
      setQr(null)
    })
  }

  async function liberar() {
    if (!pendienteDeLiberar || action.pending) return false
    return action.run(async () => { await cerrarMesa(mesaId) })
  }

  return { mesa, pedido, pago, loading, pending: action.pending, error: loadError ?? action.error, aviso: avisoQr, puedeCobrar, pendienteDeLiberar, qr, esperandoCobro, cobrar, generarQr, cancelarQr, liberar, refetch }
}
