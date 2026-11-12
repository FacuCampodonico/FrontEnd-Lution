import { useCallback, useEffect, useState } from "react"

import { getOrders } from "@/services/pedidos.service"
import type { OrderFilters, Order } from "@/types/pedido"

export function usePedidos(filters: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { mesaId, empleadoId, estado, pagina, limite } = filters

  const load = useCallback(async (isCurrent: () => boolean = () => true) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getOrders({ mesaId, empleadoId, estado, pagina, limite })
      if (!isCurrent()) return
      setOrders(response.data)
      setTotal(response.total)
    } catch {
      if (isCurrent()) setError("No se pudieron cargar los pedidos")
    } finally {
      if (isCurrent()) setLoading(false)
    }
  }, [mesaId, empleadoId, estado, pagina, limite])

  useEffect(() => {
    // If the filters change before the response arrives, the old one is discarded.
    let current = true
    void load(() => current)
    return () => {
      current = false
    }
  }, [load])

  const refetch = useCallback(() => load(), [load])

  return { orders, total, loading, error, refetch }
}

export function useOpenOrdersCount() {
  const [openCount, setOpenCount] = useState<number | null>(null)

  useEffect(() => {
    getOrders({ estado: "abierto", limite: 1 })
      .then((response) => setOpenCount(response.total))
      .catch(() => setOpenCount(null))
  }, [])

  return openCount
}
