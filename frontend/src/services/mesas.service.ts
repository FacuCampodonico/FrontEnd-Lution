import { api } from "@/lib/api"
import type { CreateTableInput, Table } from "@/types/mesa"

export async function getTables(): Promise<Table[]> {
  const { data } = await api.get<Table[]>("/mesas")
  return data
}

export async function getTable(tableId: string | number): Promise<Table> {
  const { data } = await api.get<Table>(`/mesas/${tableId}`)
  return data
}

export async function createTable(input: CreateTableInput): Promise<Table> {
  const number = Number(input.numero)
  if (!Number.isSafeInteger(number) || number <= 0) throw new Error("El número de mesa debe ser un entero positivo")
  const body = { numero: number, capacidad: input.capacidad }
  const { data } = await api.post<Table>("/mesas", body)
  return data
}

export async function closeTable(tableId: string | number): Promise<{ message: string; estado: "libre" }> {
  const { data } = await api.post<{ message: string; estado: "libre" }>(`/mesas/${tableId}/cerrar`)
  return data
}
