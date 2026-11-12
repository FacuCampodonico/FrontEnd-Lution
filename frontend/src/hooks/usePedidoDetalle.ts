import { useEffect, useState } from "react"

import { errorMessage } from "@/lib/errors"
import { getOrder } from "@/services/pedidos.service"
import type { Order } from "@/types/pedido"

export function usePedidoDetalle(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return
    let current = true
    setOrder(null)
    setLoading(true)
    setError(null)
    getOrder(orderId)
      .then((data) => { if (current) setOrder(data) })
      .catch((cause: unknown) => { if (current) setError(errorMessage(cause)) })
      .finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [orderId])

  return { order: order?.id === orderId ? order : null, loading, error }
}
