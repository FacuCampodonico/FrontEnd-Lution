import { api } from "@/lib/api"
import type { CrearMesaInput, Mesa } from "@/types/mesa"

export async function getMesas(): Promise<Mesa[]> {
  const { data } = await api.get<Mesa[]>("/mesas")
  return data
}

export async function getMesa(mesaId: string | number): Promise<Mesa> {
  const { data } = await api.get<Mesa>(`/mesas/${mesaId}`)
  return data
}

export async function createMesa(input: CrearMesaInput): Promise<Mesa> {
  const numero = Number(input.numero)
  if (!Number.isSafeInteger(numero) || numero <= 0) throw new Error("El número de mesa debe ser un entero positivo")
  const body = { numero, capacidad: input.capacidad }
  const { data } = await api.post<Mesa>("/mesas", body)
  return data
}

export async function cerrarMesa(mesaId: string | number): Promise<{ message: string; estado: "libre" }> {
  const { data } = await api.post<{ message: string; estado: "libre" }>(`/mesas/${mesaId}/cerrar`)
  return data
}
