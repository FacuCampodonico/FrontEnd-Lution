import { useEffect, useState } from "react"

import { errorMessage } from "@/lib/errors"
import { getPedido } from "@/services/pedidos.service"
import type { Pedido } from "@/types/pedido"

export function usePedidoDetalle(pedidoId: string | null) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!pedidoId) return
    let vigente = true
    setPedido(null)
    setLoading(true)
    setError(null)
    getPedido(pedidoId)
      .then((data) => { if (vigente) setPedido(data) })
      .catch((cause: unknown) => { if (vigente) setError(errorMessage(cause)) })
      .finally(() => { if (vigente) setLoading(false) })
    return () => { vigente = false }
  }, [pedidoId])

  return { pedido: pedido?.id === pedidoId ? pedido : null, loading, error }
}
