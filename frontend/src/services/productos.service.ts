import { api } from "@/lib/api"
import type { CrearProductoInput, Producto } from "@/types/producto"

export async function getProductos(): Promise<Producto[]> {
  const { data } = await api.get<Producto[]>("/productos")
  return data
}

export async function createProducto(
  input: CrearProductoInput
): Promise<Producto> {
  const { data } = await api.post<Producto>("/productos", input)
  return data
}

export async function deleteProducto(id: string): Promise<void> {
  await api.delete(`/productos/${id}`)
  return Promise.resolve()
}