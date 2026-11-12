import { api } from "@/lib/api"
import { API_UNITS } from "@/types/insumo"
import type { CreateSupplyInput, Supply } from "@/types/insumo"

export async function getSupplies(): Promise<Supply[]> {
  const { data } = await api.get<Supply[]>("/insumos")
  return data
}

export async function createSupply(input: CreateSupplyInput): Promise<Supply> {
  if (!(input.unidad in API_UNITS)) {
    throw new Error("El backend no admite esta unidad de medida; elegí una unidad compatible")
  }
  const body = {
    nombre: input.nombre,
    stockDisponible: input.stock,
    unidadMedida: API_UNITS[input.unidad],
  }
  const { data } = await api.post<Supply>("/insumos", body)
  return data
}
