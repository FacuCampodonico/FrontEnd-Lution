import { Card, CardContent } from "@/components/ui/card"
import { EstadoMesaBadge } from "@/components/mesas/EstadoMesaBadge"
import { formatCurrency } from "@/lib/utils"
import type { Mesa } from "@/types/mesa"

interface MesaCardProps {
  mesa: Mesa
  onClick?: (mesa: Mesa) => void
}

export function MesaCard({ mesa, onClick }: MesaCardProps) {
  const libre = mesa.estado === "libre"

  return (
    <Card
      role="button"
      onClick={() => onClick?.(mesa)}
      className={
        "h-full cursor-pointer justify-between transition-colors hover:bg-muted/50" +
        (libre ? " bg-muted/30" : "")
      }
    >
      <CardContent className="flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <span className="text-2xl font-semibold tracking-tight">
            {mesa.numero}
          </span>
          <EstadoMesaBadge estado={mesa.estado} />
        </div>
        {libre ? (
          <span className="text-sm font-medium text-muted-foreground">
            Abrir mesa
          </span>
        ) : (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">
              {mesa.cantidadItems} {mesa.cantidadItems === 1 ? "item" : "items"}
            </span>
            <span className="font-mono text-sm font-medium">
              {formatCurrency(mesa.totalActual)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
