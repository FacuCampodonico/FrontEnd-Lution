export type TableStatus = "libre" | "abierta" | "por_pagar"

export interface Table {
  id: string
  numero: string
  estado: TableStatus
  pedidoActualId: string | null
  totalActual: number
  cantidadItems: number
}

export interface CreateTableInput {
  numero: string
  capacidad?: number
}
