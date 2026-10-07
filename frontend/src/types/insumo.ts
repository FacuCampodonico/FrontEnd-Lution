export type UnidadMedida = "kg" | "litros" | "unidades" | "latas" | "gramos" | "mililitros"

export interface Insumo {
  id: string
  nombre: string
  stock: number
  unidad: UnidadMedida
}

export interface CrearInsumoInput {
  nombre: string
  stock: number
  unidad: UnidadMedida
}

export const UNIDADES_API = {
  kg: "KG", litros: "L", unidades: "UNIDAD", gramos: "G", mililitros: "ML",
} as const
