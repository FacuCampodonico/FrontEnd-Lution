export type UnitOfMeasure = "kg" | "litros" | "unidades" | "gramos" | "mililitros"

export interface Supply {
  id: string
  nombre: string
  stock: number
  unidad: UnitOfMeasure
}

export interface CreateSupplyInput {
  nombre: string
  stock: number
  unidad: UnitOfMeasure
}

export const API_UNITS = {
  kg: "KG", litros: "L", unidades: "UNIDAD", gramos: "G", mililitros: "ML",
} as const

/** Supply without enough stock for an order (409 STOCK_INSUFICIENTE). */
export interface StockShortage {
  insumoId: string
  nombre: string
  unidad: string
  disponible: number
  necesario: number
}
