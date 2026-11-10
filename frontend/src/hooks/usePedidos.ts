import { useCallback, useEffect, useState } from "react"

import { getPedidos } from "@/services/pedidos.service"
import type { FiltrosPedidos, Pedido } from "@/types/pedido"

export function usePedidos(filtros: FiltrosPedidos) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { mesaId, empleadoId, estado, pagina, limite } = filtros

  const cargar = useCallback(async (estaVigente: () => boolean = () => true) => {
    setLoading(true)
    setError(null)
    try {
      const respuesta = await getPedidos({ mesaId, empleadoId, estado, pagina, limite })
      if (!estaVigente()) return
      setPedidos(respuesta.data)
      setTotal(respuesta.total)
    } catch {
      if (estaVigente()) setError("No se pudieron cargar los pedidos")
    } finally {
      if (estaVigente()) setLoading(false)
    }
  }, [mesaId, empleadoId, estado, pagina, limite])

  useEffect(() => {
    // Si los filtros cambian antes de que llegue la respuesta, se descarta la vieja.
    let vigente = true
    void cargar(() => vigente)
    return () => {
      vigente = false
    }
  }, [cargar])

  const refetch = useCallback(() => cargar(), [cargar])

  return { pedidos, total, loading, error, refetch }
}

export function usePedidosAbiertos() {
  const [abiertos, setAbiertos] = useState<number | null>(null)

  useEffect(() => {
    getPedidos({ estado: "abierto", limite: 1 })
      .then((respuesta) => setAbiertos(respuesta.total))
      .catch(() => setAbiertos(null))
  }, [])

  return abiertos
}
