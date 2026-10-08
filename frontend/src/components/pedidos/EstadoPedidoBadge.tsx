import { Badge } from "@/components/ui/badge"
import type { EstadoPedido } from "@/types/pedido"

const LABELS: Record<EstadoPedido, string> = {
  abierto: "Abierto",
  pagado: "Pagado",
}

const VARIANTS: Record<EstadoPedido, "default" | "success"> = {
  abierto: "default",
  pagado: "success",
}

export function EstadoPedidoBadge({ estado }: { estado: EstadoPedido }) {
  return <Badge variant={VARIANTS[estado]}>{LABELS[estado]}</Badge>
}
