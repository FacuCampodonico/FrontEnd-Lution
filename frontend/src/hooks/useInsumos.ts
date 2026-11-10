import { useCallback, useEffect, useState } from "react"

import { createInsumo, getInsumos } from "@/services/insumos.service"
import type { CrearInsumoInput, Insumo } from "@/types/insumo"

export function useInsumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setInsumos(await getInsumos())
    } catch {
      setError("No se pudieron cargar los insumos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function crearInsumo(input: CrearInsumoInput) {
    const nuevo = await createInsumo(input)
    setInsumos((prev) => [...prev, nuevo])
    return nuevo
  }

  return { insumos, loading, error, refetch, crearInsumo }
}
