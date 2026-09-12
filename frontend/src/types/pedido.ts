export interface PedidoItem {
  id: string
  productoId: string
  productoNombre: string
  precioUnitario: number
  cantidad: number
}

export type EstadoPedido = "abierto" | "pagado"

export interface Pedido {
  id: string
  mesaId: string
  items: PedidoItem[]
  total: number
  estado: EstadoPedido
}

export interface AgregarItemInput {
  productoId: string
  cantidad: number
}
