import { useCallback, useEffect, useRef, useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { errorMessage } from "@/lib/errors"
import { getMesa } from "@/services/mesas.service"
import { agregarItem, actualizarItem, quitarItem, crearPedido, getPedidoPorMesa } from "@/services/pedidos.service"
import { getProductos } from "@/services/productos.service"
import type { Mesa } from "@/types/mesa"
import type { Pedido } from "@/types/pedido"
import type { Producto } from "@/types/producto"

export interface ItemCarrito {
  producto: Producto
  cantidad: number
}

export function useMesaDetalle(mesaId: string) {
  const [mesa, setMesa] = useState<Mesa | null>(null)
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [catalogo, setCatalogo] = useState<Producto[]>([])
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const action = useAsyncAction()
  const { clearError } = action
  const currentMesaId = useRef(mesaId)
  currentMesaId.current = mesaId

  const refetch = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    clearError()
    try {
      const [mesaData, pedidoData, catalogoData] = await Promise.all([
        getMesa(mesaId), getPedidoPorMesa(mesaId), getProductos(),
      ])
      if (currentMesaId.current !== mesaId) return
      setMesa(mesaData)
      setPedido(pedidoData)
      setCatalogo(catalogoData)
      setNeedsRefresh(false)
      if (pedidoData) setCarrito([])
    } catch (cause) {
      if (currentMesaId.current === mesaId) setLoadError(errorMessage(cause))
    } finally {
      if (currentMesaId.current === mesaId) setLoading(false)
    }
  }, [mesaId, clearError])

  useEffect(() => {
    setMesa(null)
    setPedido(null)
    setCarrito([])
    setNeedsRefresh(false)
    void refetch()
  }, [refetch])

  const bloqueado = loading || loadError !== null || action.pending || needsRefresh || !mesa || mesa.estado === "por_pagar" || pedido?.estado === "pagado"

  async function recibirPedido(actualizado: Pedido) {
    if (currentMesaId.current !== mesaId) return
    setPedido(actualizado)
    setCarrito([])
    setNeedsRefresh(true)
    try {
      const nuevaMesa = await getMesa(mesaId)
      if (currentMesaId.current !== mesaId) return
      setMesa(nuevaMesa)
      setNeedsRefresh(false)
    } catch {
      throw new Error("El pedido se guardó, pero no se pudo actualizar la mesa. Recargá los datos antes de continuar.")
    }
  }

  async function agregarProducto(producto: Producto) {
    if (bloqueado) return
    if (pedido) {
      await action.run(async () => recibirPedido(await agregarItem(pedido.id, { productoId: producto.id, cantidad: 1 })))
      return
    }
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id)
      return existente
        ? prev.map((item) => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...prev, { producto, cantidad: 1 }]
    })
  }

  async function cambiarCantidad(itemId: string, cantidad: number) {
    if (bloqueado || !Number.isSafeInteger(cantidad) || cantidad < 1) return
    if (pedido) {
      await action.run(async () => recibirPedido(await actualizarItem(pedido.id, itemId, { cantidad })))
    } else {
      setCarrito((prev) => prev.map((item) => item.producto.id === itemId ? { ...item, cantidad } : item))
    }
  }

  async function quitarProducto(itemId: string) {
    if (bloqueado) return
    if (pedido) {
      await action.run(async () => recibirPedido(await quitarItem(pedido.id, itemId)))
    } else {
      setCarrito((prev) => prev.filter((item) => item.producto.id !== itemId))
    }
  }

  async function confirmarPedido() {
    if (bloqueado || pedido || carrito.length === 0) return
    await action.run(async () => {
      const nuevo = await crearPedido(mesaId, carrito.map((item) => ({ productoId: item.producto.id, cantidad: item.cantidad })))
      if (currentMesaId.current !== mesaId) return
      if (nuevo) {
        await recibirPedido(nuevo)
      } else {
        setNeedsRefresh(true)
        const recuperado = await getPedidoPorMesa(mesaId)
        if (!recuperado) throw new Error("El backend no devolvió el pedido creado. Recargá los datos de la mesa antes de continuar.")
        await recibirPedido(recuperado)
      }
    })
  }

  return {
    mesa, pedido, catalogo, carrito, loading, pending: action.pending, bloqueado,
    error: loadError ?? action.error, refetch, agregarProducto, cambiarCantidad,
    quitarProducto, confirmarPedido,
  }
}
