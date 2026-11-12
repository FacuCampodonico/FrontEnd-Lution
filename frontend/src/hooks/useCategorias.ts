import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createCategory as createCategoryService, getCategories } from "@/services/categorias.service"
import type { Category, CreateCategoryInput } from "@/types/categoria"

export function useCategorias() {
  const [categories, setCategories] = useState<Category[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: true, failureMessage: "No se pudieron cargar las categorías" })

  const refetch = useCallback(() => run(async () => setCategories(await getCategories())), [run])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function createCategory(input: CreateCategoryInput) {
    const created = await createCategoryService(input)
    setCategories((prev) => [...prev, created])
    return created
  }


  return { categories, loading, error, refetch, createCategory }
}
