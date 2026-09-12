export type EstadoMesa = "libre" | "abierta" | "por_pagar"

export interface Mesa {
  id: string
  numero: string
  estado: EstadoMesa
  pedidoActualId: string | null
  totalActual: number
  cantidadItems: number
}

export interface CrearMesaInput {
  numero: string
}
