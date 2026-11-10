import { api } from "@/lib/api"
import { UNIDADES_API } from "@/types/insumo"
import type { CrearInsumoInput, Insumo } from "@/types/insumo"

export async function getInsumos(): Promise<Insumo[]> {
  const { data } = await api.get<Insumo[]>("/insumos")
  return data
}

export async function createInsumo(input: CrearInsumoInput): Promise<Insumo> {
  if (!(input.unidad in UNIDADES_API)) {
    throw new Error("El backend no admite esta unidad de medida; elegí una unidad compatible")
  }
  const body = {
    nombre: input.nombre,
    stockDisponible: input.stock,
    unidadMedida: UNIDADES_API[input.unidad],
  }
  const { data } = await api.post<Insumo>("/insumos", body)
  return data
}
