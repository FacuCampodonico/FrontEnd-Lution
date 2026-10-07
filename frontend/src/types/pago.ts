export type MetodoPago = "efectivo" | "tarjeta"

export interface CrearPagoInput {
  pedidoId: string
  metodo: MetodoPago
  pagaCon?: number
  titular?: string
  marca?: string
  cuotas?: number
}

export interface PagoRegistrado {
  message: string
  pedidoId: string
  total: number
  vuelto: number
}
