export type UnidadMedida = "kg" | "litros" | "unidades" | "gramos" | "mililitros"

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

/** Insumo al que no le alcanza el stock para un pedido (409 STOCK_INSUFICIENTE). */
export interface FaltanteStock {
  insumoId: string
  nombre: string
  unidad: string
  disponible: number
  necesario: number
}
