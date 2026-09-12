import { useCallback, useEffect, useState } from "react"

import { getMesa } from "@/services/mesas.service"
import { crearPedido as crearPedidoService, getPedidoPorMesa } from "@/services/pedidos.service"
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
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [mesaData, pedidoData, catalogoData] = await Promise.all([
        getMesa(mesaId),
        getPedidoPorMesa(mesaId),
        getProductos(),
      ])
      setMesa(mesaData)
      setPedido(pedidoData)
      setCatalogo(catalogoData)
    } catch {
      setError("No se pudo cargar la mesa")
    } finally {
      setLoading(false)
    }
  }, [mesaId])

  useEffect(() => {
    void refetch()
  }, [refetch])

  // El carrito es solo estado de UI: recién se persiste como pedido
  // (Mesa-Producto) al confirmar "Crear pedido".
  function agregarAlCarrito(producto: Producto) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id)
      if (existente) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { producto, cantidad: 1 }]
    })
  }

  async function confirmarPedido() {
    const nuevoPedido = await crearPedidoService(
      mesaId,
      carrito.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      }))
    )
    setPedido(nuevoPedido)
    setCarrito([])
    return nuevoPedido
  }

  return {
    mesa,
    pedido,
    catalogo,
    carrito,
    loading,
    error,
    refetch,
    agregarAlCarrito,
    confirmarPedido,
  }
}
