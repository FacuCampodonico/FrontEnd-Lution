import { api } from "@/lib/api"
import type { CrearMesaInput, Mesa } from "@/types/mesa"

export async function getMesas(): Promise<Mesa[]> {
  const { data } = await api.get<Mesa[]>("/mesas")
  return data
}

export async function getMesa(mesaId: string): Promise<Mesa> {
  const { data } = await api.get<Mesa>(`/mesas/${mesaId}`)
  return data
}

export async function createMesa(input: CrearMesaInput): Promise<Mesa> {
  const { data } = await api.post<Mesa>("/mesas", input)
  return data
}
