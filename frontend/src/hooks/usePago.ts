import { useCallback, useEffect, useRef, useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { errorMessage } from "@/lib/errors"
import { cerrarMesa, getMesa } from "@/services/mesas.service"
import { createPago } from "@/services/pagos.service"
import { getPedidoPorMesa } from "@/services/pedidos.service"
import type { Mesa } from "@/types/mesa"
import type { Pedido } from "@/types/pedido"
import type { MetodoPago, PagoRegistrado } from "@/types/pago"

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

  const pagado = pago !== null || mesa?.estado === "por_pagar" || pedido?.estado === "pagado"
  const puedeCobrar = !loading && !loadError && !action.pending && !pagado && pedido !== null && pedido.estado === "abierto"
  const puedeCerrar = !loading && !action.pending && pagado

  async function cobrar(metodo: MetodoPago, pagaCon?: number) {
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
      try {
        const mesaActual = await getMesa(mesaId)
        if (currentMesaId.current === mesaId) setMesa(mesaActual)
      } catch {
        throw new Error("El pago se registró. No se pudo actualizar la mesa; podés continuar con el cierre sin volver a cobrar.")
      }
    })
  }

  async function cerrar() {
    if (!puedeCerrar) return false
    return action.run(async () => { await cerrarMesa(mesaId) })
  }

  return { mesa, pedido, pago, loading, pending: action.pending, error: loadError ?? action.error, pagado, puedeCobrar, puedeCerrar, cobrar, cerrar, refetch }
}
