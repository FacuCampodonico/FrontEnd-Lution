import { api } from "@/lib/api"
import type { CrearCategoriaRequest, Categoria, CrearCategoriaInput } from "@/types/categoria"

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categorias")
  return data
}

export async function createCategoria(input: CrearCategoriaRequest | CrearCategoriaInput): Promise<Categoria> {
  if ("productoIds" in input && input.productoIds.length) {
    throw new Error("El backend no permite asignar productos al crear una categoría")
  }
  const body: CrearCategoriaRequest = { nombre: input.nombre }
  const { data } = await api.post<Categoria>("/categorias", body)
  return data
}
