import { api } from "@/lib/api"
import type { CrearPagoInput, Pago } from "@/types/pago"

export async function createPago(input: CrearPagoInput): Promise<Pago> {
  const { data } = await api.post<Pago>("/pagos", input)
  return data
}
