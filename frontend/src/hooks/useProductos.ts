import { useCallback, useEffect, useState } from "react"

import { createProducto, getProductos, deleteProducto } from "@/services/productos.service"
import type { CrearProductoInput, Producto } from "@/types/producto"

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProductos(await getProductos())
    } catch {
      setError("No se pudieron cargar los productos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function crearProducto(input: CrearProductoInput) {
    const nuevo = await createProducto(input)
    setProductos((prev) => [...prev, nuevo])
    return nuevo
  }

  function actualizarProducto(id: string, productoActualizado: Partial<Producto>) {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productoActualizado } : p))
    )
  }

  async function eliminarProducto(id: string) {
    try {
      await deleteProducto(id)
      setProductos((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError("No se pudo eliminar el producto")
    }
  }

  return { productos, loading, error, refetch, crearProducto, actualizarProducto, eliminarProducto }
}
