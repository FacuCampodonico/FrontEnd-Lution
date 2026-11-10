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
  empleadoId: string | null
  empleadoNombre: string | null
}

export interface FiltrosPedidos {
  mesaId?: string
  empleadoId?: string
  estado?: EstadoPedido
  pagina?: number
  limite?: number
}

export interface PedidosPaginados {
  data: Pedido[]
  total: number
  pagina: number
  limite: number
}

export interface AgregarItemInput {
  productoId: string
  cantidad: number
  comentario?: string
}

export interface ActualizarItemInput {
  cantidad?: number
  comentario?: string
}
