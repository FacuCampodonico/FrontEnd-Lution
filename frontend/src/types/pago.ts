export type MetodoPagoManual = "efectivo"
export type MetodoPago = MetodoPagoManual | "mercadopago"

export interface CrearPagoInput {
  pedidoId: string
  metodo: MetodoPagoManual
  pagaCon?: number
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
  /** Cuándo vence el QR (ISO 8601). */
  expiraEn: string
}

export type EstadoCobroMercadoPago = "sin_cobro" | "pendiente" | "pagado"

export interface EstadoCobroMercadoPagoResponse {
  estado: EstadoCobroMercadoPago
  expiraEn?: string
  total?: number
}
