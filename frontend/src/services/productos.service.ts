import { api } from "@/lib/api"
import type { ProductResponse, CreateProductInput, UpdateProductInput } from "@/types/producto"

export async function getProducts(): Promise<ProductResponse[]> {
  const { data } = await api.get<ProductResponse[]>("/productos")
  return data
}

export async function getProduct(id: string | number): Promise<ProductResponse> {
  const { data } = await api.get<ProductResponse>(`/productos/${id}`)
  return data
}

export async function createProduct(input: CreateProductInput): Promise<ProductResponse> {
  if (!input.descripcion?.trim()) throw new Error("La descripción del producto es obligatoria")
  const categoryId = Number(input.categoriaId)
  const body = {
    nombre: input.nombre, descripcion: input.descripcion,
    precio: input.precio, idCategoria: categoryId,
    recetas: (input.recetas ?? []).map((item) => ({
      insumoId: Number(item.insumoId),
      cantidad: item.cantidad,
    })),
  }
  const { data } = await api.post<ProductResponse>("/productos", body)
  return data
}

export async function deleteProduct(id: string | number): Promise<void> {
  await api.delete(`/productos/${id}`)
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<ProductResponse> {
  const body = {
    nombre: input.nombre,
    descripcion: input.descripcion,
    precio: input.precio,
    idCategoria: input.categoriaId === undefined ? undefined : Number(input.categoriaId),
    recetas: input.recetas?.map((item) => ({
      insumoId: Number(item.insumoId),
      cantidad: item.cantidad,
    })),
  }
  const { data } = await api.patch<ProductResponse | null>(`/productos/${id}`, body)
  if (!data) throw new Error("El backend no devolvió el producto actualizado")
  return data
}
