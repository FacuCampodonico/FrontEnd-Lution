import { api } from "@/lib/api"
import type { ProductoServicio, CrearProductoInput, ActualizarProductoInput } from "@/types/producto"

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
  const idCategoria = Number(input.categoriaId)
  const body = {
    nombre: input.nombre, descripcion: input.descripcion,
    precio: input.precio, idCategoria,
    recetas: (input.recetas ?? []).map((receta) => ({
      insumoId: Number(receta.insumoId),
      cantidad: receta.cantidad,
    })),
  }
  const { data } = await api.post<ProductoServicio>("/productos", body)
  return data
}

export async function deleteProducto(id: string | number): Promise<void> {
  await api.delete(`/productos/${id}`)
}

export async function updateProducto(id: string, input: ActualizarProductoInput): Promise<ProductoServicio> {
  const body = {
    nombre: input.nombre,
    descripcion: input.descripcion,
    precio: input.precio,
    idCategoria: input.categoriaId === undefined ? undefined : Number(input.categoriaId),
    recetas: input.recetas?.map((receta) => ({
      insumoId: Number(receta.insumoId),
      cantidad: receta.cantidad,
    })),
  }
  const { data } = await api.patch<ProductoServicio | null>(`/productos/${id}`, body)
  if (!data) throw new Error("El backend no devolvió el producto actualizado")
  return data
}
