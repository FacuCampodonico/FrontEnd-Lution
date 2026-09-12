import { useCallback, useEffect, useState } from "react"

import { createCategoria, getCategorias } from "@/services/categorias.service"
import type { Categoria, CrearCategoriaInput } from "@/types/categoria"

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setCategorias(await getCategorias())
    } catch {
      setError("No se pudieron cargar las categorías")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function crearCategoria(input: CrearCategoriaInput) {
    const nueva = await createCategoria(input)
    setCategorias((prev) => [...prev, nueva])
    return nueva
  }

  return { categorias, loading, error, refetch, crearCategoria }
}
