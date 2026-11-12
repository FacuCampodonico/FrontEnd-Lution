import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createProduct as createProductService, getProducts, deleteProduct as deleteProductService, updateProduct as updateProductService } from "@/services/productos.service"
import type { CreateProductInput, Product, UpdateProductInput } from "@/types/producto"

export function useProductos() {
  const [products, setProducts] = useState<Product[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: true, failureMessage: "No se pudieron cargar los productos" })

  const refetch = useCallback(() => run(async () => setProducts(await getProducts())), [run])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function createProduct(input: CreateProductInput) {
    const created = await createProductService(input)
    setProducts((prev) => [...prev, created])
    return created
  }

  async function updateProduct(id: string, input: UpdateProductInput) {
    const updated = await updateProductService(id, input)
    setProducts((prev) => prev.map((product) => product.id === id ? updated : product))
    return updated
  }

  async function deleteProduct(id: string) {
    await deleteProductService(id)
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  return { products, loading, error, refetch, createProduct, updateProduct, deleteProduct }
}
