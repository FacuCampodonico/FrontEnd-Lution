import { useCallback, useEffect, useState } from "react"

import { createMesa, getMesas } from "@/services/mesas.service"
import type { CrearMesaInput, Mesa } from "@/types/mesa"

export function useMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setMesas(await getMesas())
    } catch {
      setError("No se pudieron cargar las mesas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function crearMesa(input: CrearMesaInput) {
    const nueva = await createMesa(input)
    setMesas((prev) => [...prev, nueva])
    return nueva
  }

  return { mesas, loading, error, refetch, crearMesa }
}
