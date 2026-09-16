import { useCallback, useEffect, useState } from "react"

import { createProducto, getProductos } from "@/services/productos.service"
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

  return { productos, loading, error, refetch, crearProducto, actualizarProducto }
}
