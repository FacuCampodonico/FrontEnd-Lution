import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/types/pedido"

const LABELS: Record<OrderStatus, string> = {
  abierto: "Abierto",
  pagado: "Pagado",
}

const VARIANTS: Record<OrderStatus, "default" | "success"> = {
  abierto: "default",
  pagado: "success",
}

export function EstadoPedidoBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>
}
