import { api } from "@/lib/api"
import type { PagoRegistrado, CrearPagoInput, PreferenciaMercadoPago, EstadoCobroMercadoPagoResponse } from "@/types/pago"

export async function createPago(input: CrearPagoInput): Promise<PagoRegistrado> {
  const pagaCon = input.pagaCon
  if (pagaCon === undefined || !Number.isFinite(pagaCon) || pagaCon <= 0) {
    throw new Error("El monto recibido en efectivo (pagaCon) es obligatorio")
  }
  const body = { tipo: "EFECTIVO", pagaCon }
  const { data } = await api.post<PagoRegistrado>(`/pedidos/${input.pedidoId}/pago`, body)
  return data
}

export async function crearPreferenciaMercadoPago(pedidoId: string): Promise<PreferenciaMercadoPago> {
  const { data } = await api.post<PreferenciaMercadoPago>(`/pedidos/${pedidoId}/pago/mercadopago`)
  return data
}

/** El back consulta a Mercado Pago y, si el cliente ya pagó, cierra el pedido. */
export async function getEstadoCobroMercadoPago(pedidoId: string): Promise<EstadoCobroMercadoPagoResponse> {
  const { data } = await api.get<EstadoCobroMercadoPagoResponse>(`/pedidos/${pedidoId}/pago/mercadopago/estado`)
  return data
}

export async function cancelarCobroMercadoPago(pedidoId: string): Promise<void> {
  await api.delete(`/pedidos/${pedidoId}/pago/mercadopago`)
}
