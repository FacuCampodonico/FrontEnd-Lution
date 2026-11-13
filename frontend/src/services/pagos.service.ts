import { api } from "@/lib/api"
import type { RegisteredPayment, CreatePaymentInput, MercadoPagoPreference, MercadoPagoChargeStatusResponse } from "@/types/pago"

export async function createPayment(input: CreatePaymentInput): Promise<RegisteredPayment> {
  const cashReceived = input.pagaCon
  if (cashReceived === undefined || !Number.isFinite(cashReceived) || cashReceived <= 0) {
    throw new Error("El monto recibido en efectivo (pagaCon) es obligatorio")
  }
  const body = { tipo: "EFECTIVO", pagaCon: cashReceived }
  const { data } = await api.post<RegisteredPayment>(`/pedidos/${input.pedidoId}/pago`, body)
  return data
}

export async function createMercadoPagoPreference(orderId: string): Promise<MercadoPagoPreference> {
  const { data } = await api.post<MercadoPagoPreference>(`/pedidos/${orderId}/pago/mercadopago`)
  return data
}

/** The backend asks Mercado Pago and, if the customer already paid, closes the order. */
export async function getMercadoPagoChargeStatus(orderId: string): Promise<MercadoPagoChargeStatusResponse> {
  const { data } = await api.get<MercadoPagoChargeStatusResponse>(`/pedidos/${orderId}/pago/mercadopago/estado`)
  return data
}

export async function cancelMercadoPagoCharge(orderId: string): Promise<void> {
  await api.delete(`/pedidos/${orderId}/pago/mercadopago`)
}
