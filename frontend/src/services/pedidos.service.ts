import { api } from "@/lib/api"
import type { UpdateItemInput, AddItemInput, OrderFilters, Order, PaginatedOrders } from "@/types/pedido"

/** With allowWithoutStock the backend saves the order even if stock goes negative. */
function stockParams(allowWithoutStock: boolean) {
  return allowWithoutStock ? { params: { permitirSinStock: true } } : undefined
}

export async function getOrders(filters: OrderFilters = {}): Promise<PaginatedOrders> {
  const { data } = await api.get<PaginatedOrders>("/pedidos", { params: filters })
  return data
}

export async function getOrderByTable(tableId: string | number): Promise<Order | null> {
  const { data } = await api.get<Order | null>(`/mesas/${tableId}/pedido`)
  return data
}

export async function getOrder(orderId: string | number): Promise<Order> {
  const { data } = await api.get<Order>(`/pedidos/${orderId}`)
  return data
}

export async function createOrder(
  tableId: string | number,
  items: AddItemInput[],
  employeeId: string | number,
  allowWithoutStock = false,
): Promise<Order | null> {
  const body = {
    empleadoId: Number(employeeId),
    items: items.map((item) => ({ productoId: Number(item.productoId), cantidad: item.cantidad })),
  }
  const { data } = await api.post<Order | null>(`/mesas/${tableId}/pedido`, body, stockParams(allowWithoutStock))
  return data
}

export async function cancelOrder(orderId: string | number): Promise<void> {
  await api.delete(`/pedidos/${orderId}`)
}

export async function addItem(
  orderId: string | number, input: AddItemInput, allowWithoutStock = false,
): Promise<Order> {
  const body = {
    productoId: Number(input.productoId), cantidad: input.cantidad,
    comentario: input.comentario,
  }
  const { data } = await api.post<Order>(`/pedidos/${orderId}/items`, body, stockParams(allowWithoutStock))
  return data
}

export async function updateItem(
  orderId: string | number, itemId: string | number, input: UpdateItemInput, allowWithoutStock = false,
): Promise<Order> {
  const body = { cantidad: input.cantidad, comentario: input.comentario }
  const { data } = await api.patch<Order>(`/pedidos/${orderId}/items/${itemId}`, body, stockParams(allowWithoutStock))
  return data
}

export async function removeItem(orderId: string | number, itemId: string | number): Promise<Order> {
  const { data } = await api.delete<Order>(`/pedidos/${orderId}/items/${itemId}`)
  return data
}
