import { api } from "@/lib/api"
import type { AgregarItemInput, Pedido } from "@/types/pedido"

export async function getPedidoPorMesa(mesaId: string): Promise<Pedido | null> {
  const { data } = await api.get<Pedido | null>(`/mesas/${mesaId}/pedido`)
  return data
}

export async function crearPedido(
  mesaId: string,
  items: AgregarItemInput[]
): Promise<Pedido> {
  const { data } = await api.post<Pedido>(`/mesas/${mesaId}/pedido`, { items })
  return data
}

export async function agregarItem(
  pedidoId: string,
  input: AgregarItemInput
): Promise<Pedido> {
  const { data } = await api.post<Pedido>(`/pedidos/${pedidoId}/items`, input)
  return data
}

export async function quitarItem(
  pedidoId: string,
  itemId: string
): Promise<Pedido> {
  const { data } = await api.delete<Pedido>(`/pedidos/${pedidoId}/items/${itemId}`)
  return data
}
