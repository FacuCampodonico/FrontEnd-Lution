import { useCallback, useEffect, useState } from "react"

import { getPedidos } from "@/services/pedidos.service"
import type { Pedido } from "@/types/pedido"

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPedidos(await getPedidos())
    } catch {
      setError("No se pudieron cargar los pedidos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { pedidos, loading, error, refetch }
}
