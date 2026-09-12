export type MetodoPago = "efectivo" | "tarjeta"

export interface Pago {
  id: string
  pedidoId: string
  metodo: MetodoPago
  monto: number
  fecha: string
}

export interface CrearPagoInput {
  pedidoId: string
  metodo: MetodoPago
}
