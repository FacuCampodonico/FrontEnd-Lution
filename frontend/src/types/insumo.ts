export type UnidadMedida = "kg" | "litros" | "unidades" | "latas" | "gramos"

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
