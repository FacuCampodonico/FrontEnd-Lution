export interface OrderItem {
  id: string
  productoId: string
  productoNombre: string
  precioUnitario: number
  cantidad: number
}

export type OrderStatus = "abierto" | "pagado"

export interface Order {
  id: string
  mesaId: string
  items: OrderItem[]
  total: number
  estado: OrderStatus
  empleadoId: string | null
  empleadoNombre: string | null
  /** There is a live Mercado Pago QR: the order can't be modified. */
  cobroMercadoPagoPendiente: boolean
}

export interface OrderFilters {
  mesaId?: string
  empleadoId?: string
  estado?: OrderStatus
  pagina?: number
  limite?: number
}

export interface PaginatedOrders {
  data: Order[]
  total: number
  pagina: number
  limite: number
}

export interface AddItemInput {
  productoId: string
  cantidad: number
  comentario?: string
}

export interface UpdateItemInput {
  cantidad?: number
  comentario?: string
}
