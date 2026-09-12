import { api } from "@/lib/api"
import type { Categoria, CrearCategoriaInput } from "@/types/categoria"

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categorias")
  return data
}

export async function createCategoria(
  input: CrearCategoriaInput
): Promise<Categoria> {
  const { data } = await api.post<Categoria>("/categorias", input)
  return data
}
