import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createCategoria, getCategorias } from "@/services/categorias.service"
import type { Categoria, CrearCategoriaInput } from "@/types/categoria"

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: true, failureMessage: "No se pudieron cargar las categorías" })

  const refetch = useCallback(() => run(async () => setCategorias(await getCategorias())), [run])

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
