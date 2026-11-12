import { api } from "@/lib/api"
import type { RegisteredPayment, CreatePaymentInput, MercadoPagoPreference, MercadoPagoChargeStatusResponse } from "@/types/pago"

export async function createPayment(input: CreatePaymentInput): Promise<RegisteredPayment> {
  const type = input.method === "cash" ? "EFECTIVO" : "TARJETA"
  const cashReceived = input.pagaCon
  if (type === "EFECTIVO" && (cashReceived === undefined || !Number.isFinite(cashReceived) || cashReceived <= 0)) {
    throw new Error("El monto recibido en efectivo (pagaCon) es obligatorio")
  }
  const body = type === "EFECTIVO"
    ? { tipo: type, pagaCon: cashReceived }
    : { tipo: type, titular: input.titular, marca: input.marca, cuotas: input.cuotas }
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
