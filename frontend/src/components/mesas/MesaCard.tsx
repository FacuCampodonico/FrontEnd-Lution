import { Card, CardContent } from "@/components/ui/card"
import { EstadoMesaBadge } from "@/components/mesas/EstadoMesaBadge"
import { formatCurrency } from "@/lib/utils"
import type { Table } from "@/types/mesa"

interface MesaCardProps {
  table: Table
  onClick?: (table: Table) => void
}

export function MesaCard({ table, onClick }: MesaCardProps) {
  const free = table.estado === "libre"

  return (
    <Card
      role="button"
      onClick={() => onClick?.(table)}
      className={
        "h-full cursor-pointer justify-between transition-colors hover:bg-muted/50" +
        (free ? " bg-muted/30" : "")
      }
    >
      <CardContent className="flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <span className="text-2xl font-semibold tracking-tight">
            {table.numero}
          </span>
          <EstadoMesaBadge status={table.estado} />
        </div>
        {free ? (
          <span className="text-sm font-medium text-muted-foreground">
            Abrir mesa
          </span>
        ) : (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">
              {table.cantidadItems} {table.cantidadItems === 1 ? "item" : "items"}
            </span>
            <span className="font-mono text-sm font-medium">
              {formatCurrency(table.totalActual)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
