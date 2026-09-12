import { api } from "@/lib/api"
import type { CrearInsumoInput, Insumo } from "@/types/insumo"

export async function getInsumos(): Promise<Insumo[]> {
  const { data } = await api.get<Insumo[]>("/insumos")
  return data
}

export async function createInsumo(input: CrearInsumoInput): Promise<Insumo> {
  const { data } = await api.post<Insumo>("/insumos", input)
  return data
}
