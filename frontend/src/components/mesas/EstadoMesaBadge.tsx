import { Badge } from "@/components/ui/badge"
import type { EstadoMesa } from "@/types/mesa"

const LABELS: Record<EstadoMesa, string> = {
  libre: "Libre",
  abierta: "Abierta",
  por_pagar: "Por pagar",
}

const VARIANTS: Record<EstadoMesa, "outline" | "default" | "success"> = {
  libre: "outline",
  abierta: "default",
  por_pagar: "success",
}

export function EstadoMesaBadge({ estado }: { estado: EstadoMesa }) {
  return <Badge variant={VARIANTS[estado]}>{LABELS[estado]}</Badge>
}
