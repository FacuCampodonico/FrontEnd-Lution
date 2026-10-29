export type MetodoPagoManual = "efectivo" | "tarjeta"
export type MetodoPago = MetodoPagoManual | "mercadopago"

export interface CrearPagoInput {
  pedidoId: string
  metodo: MetodoPagoManual
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

export interface PreferenciaMercadoPago {
  preferenceId: string
  checkoutUrl: string
}

/** Query params con los que Mercado Pago vuelve a la pantalla de pago. */
export interface RetornoMercadoPago {
  pedidoId: string
  paymentId: string | null
  status: string | null
}
