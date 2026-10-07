import { api } from "@/lib/api"
import type { PagoRegistrado, CrearPagoInput } from "@/types/pago"

export async function createPago(input: CrearPagoInput): Promise<PagoRegistrado> {
  const tipo = input.metodo === "efectivo" ? "EFECTIVO" : "TARJETA"
  const pagaCon = input.pagaCon
  if (tipo === "EFECTIVO" && (pagaCon === undefined || !Number.isFinite(pagaCon) || pagaCon <= 0)) {
    throw new Error("El monto recibido en efectivo (pagaCon) es obligatorio")
  }
  const body = tipo === "EFECTIVO"
    ? { tipo, pagaCon }
    : { tipo, titular: input.titular, marca: input.marca, cuotas: input.cuotas }
  const { data } = await api.post<PagoRegistrado>(`/pedidos/${input.pedidoId}/pago`, body)
  return data
}
