import { Badge } from "@/components/ui/badge"
import type { TableStatus } from "@/types/mesa"

const LABELS: Record<TableStatus, string> = {
  libre: "Libre",
  abierta: "Abierta",
  por_pagar: "Por pagar",
}

const VARIANTS: Record<TableStatus, "outline" | "default" | "success"> = {
  libre: "outline",
  abierta: "default",
  por_pagar: "success",
}

export function EstadoMesaBadge({ status }: { status: TableStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>
}
