export type ManualPaymentMethod = "cash"
export type PaymentMethod = ManualPaymentMethod | "mercadopago"

export interface CreatePaymentInput {
  pedidoId: string
  method: ManualPaymentMethod
  pagaCon?: number
}

export interface RegisteredPayment {
  message: string
  pedidoId: string
  total: number
  vuelto: number
}

export interface MercadoPagoPreference {
  preferenceId: string
  checkoutUrl: string
  /** When the QR expires (ISO 8601). */
  expiraEn: string
}

export type MercadoPagoChargeStatus = "sin_cobro" | "pendiente" | "pagado"

export interface MercadoPagoChargeStatusResponse {
  estado: MercadoPagoChargeStatus
  expiraEn?: string
  total?: number
}
