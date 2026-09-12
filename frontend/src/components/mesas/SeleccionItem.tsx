import { formatCurrency } from "@/lib/utils"
import type { PedidoItem } from "@/types/pedido"

export function SeleccionItem({ item }: { item: PedidoItem }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2.5 last:border-b-0">
      <div className="flex items-center gap-2.5">
        <span className="rounded bg-muted px-1.5 py-1 font-mono text-xs text-muted-foreground">
          {item.cantidad}
        </span>
        <span className="text-sm">{item.productoNombre}</span>
      </div>
      <span className="font-mono text-sm font-medium">
        {formatCurrency(item.precioUnitario * item.cantidad)}
      </span>
    </div>
  )
}
