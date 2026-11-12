import { api } from "@/lib/api"
import type { CreateCategoryRequest, Category, CreateCategoryInput } from "@/types/categoria"

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categorias")
  return data
}

export async function createCategory(input: CreateCategoryRequest | CreateCategoryInput): Promise<Category> {
  if ("productoIds" in input && Array.isArray(input.productoIds) && input.productoIds.length) {
    throw new Error("El backend no permite asignar productos al crear una categoría")
  }
  const body: CreateCategoryRequest = { nombre: input.nombre }
  const { data } = await api.post<Category>("/categorias", body)
  return data
}
