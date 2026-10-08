import { api } from "@/lib/api"
import type { ActualizarItemInput, AgregarItemInput, Pedido } from "@/types/pedido"

export async function getPedidos(): Promise<Pedido[]> {
  const { data } = await api.get<Pedido[]>("/pedidos")
  return data
}

export async function getPedidoPorMesa(mesaId: string | number): Promise<Pedido | null> {
  const { data } = await api.get<Pedido | null>(`/mesas/${mesaId}/pedido`)
  return data
}

export async function getPedido(pedidoId: string | number): Promise<Pedido> {
  const { data } = await api.get<Pedido>(`/pedidos/${pedidoId}`)
  return data
}

export async function crearPedido(
  mesaId: string | number,
  items: AgregarItemInput[],
  empleadoId: string | number,
): Promise<Pedido | null> {
  const body = {
    empleadoId: Number(empleadoId),
    items: items.map((item) => ({ productoId: Number(item.productoId), cantidad: item.cantidad })),
  }
  const { data } = await api.post<Pedido | null>(`/mesas/${mesaId}/pedido`, body)
  return data
}

export async function cancelarPedido(pedidoId: string | number): Promise<void> {
  await api.delete(`/pedidos/${pedidoId}`)
}

export async function agregarItem(
  pedidoId: string | number, input: AgregarItemInput,
): Promise<Pedido> {
  const body = {
    productoId: Number(input.productoId), cantidad: input.cantidad,
    comentario: input.comentario,
  }
  const { data } = await api.post<Pedido>(`/pedidos/${pedidoId}/items`, body)
  return data
}

export async function actualizarItem(
  pedidoId: string | number, itemId: string | number, input: ActualizarItemInput,
): Promise<Pedido> {
  const body = { cantidad: input.cantidad, comentario: input.comentario }
  const { data } = await api.patch<Pedido>(`/pedidos/${pedidoId}/items/${itemId}`, body)
  return data
}

export async function quitarItem(pedidoId: string | number, itemId: string | number): Promise<Pedido> {
  const { data } = await api.delete<Pedido>(`/pedidos/${pedidoId}/items/${itemId}`)
  return data
}
