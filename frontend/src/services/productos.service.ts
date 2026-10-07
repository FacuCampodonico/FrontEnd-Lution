import { api } from "@/lib/api"
import type { ProductoServicio, CrearProductoInput } from "@/types/producto"

export async function getProductos(): Promise<ProductoServicio[]> {
  const { data } = await api.get<ProductoServicio[]>("/productos")
  return data
}

export async function getProducto(id: string | number): Promise<ProductoServicio> {
  const { data } = await api.get<ProductoServicio>(`/productos/${id}`)
  return data
}

export async function createProducto(input: CrearProductoInput): Promise<ProductoServicio> {
  if (!input.descripcion?.trim()) throw new Error("La descripción del producto es obligatoria")
  if (input.insumoIds.length) {
    throw new Error("El backend no permite guardar insumos o recetas desde productos")
  }
  const idCategoria = Number(input.categoriaId)
  const body = {
    nombre: input.nombre, descripcion: input.descripcion,
    precio: input.precio, idCategoria,
  }
  const { data } = await api.post<ProductoServicio>("/productos", body)
  return data
}

export async function deleteProducto(id: string | number): Promise<void> {
  await api.delete(`/productos/${id}`)
}
