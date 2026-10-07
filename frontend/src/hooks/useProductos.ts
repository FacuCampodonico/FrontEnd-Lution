import { useCallback, useEffect, useState } from "react"

import { createProducto, getProductos, deleteProducto, updateProducto } from "@/services/productos.service"
import type { CrearProductoInput, Producto, ActualizarProductoInput } from "@/types/producto"

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

  async function actualizarProducto(id: string, input: ActualizarProductoInput) {
    const actualizado = await updateProducto(id, input)
    setProductos((prev) => prev.map((producto) => producto.id === id ? actualizado : producto))
    return actualizado
  }

  async function eliminarProducto(id: string) {
    await deleteProducto(id)
    setProductos((prev) => prev.filter((producto) => producto.id !== id))
  }

  return { productos, loading, error, refetch, crearProducto, actualizarProducto, eliminarProducto }
}
