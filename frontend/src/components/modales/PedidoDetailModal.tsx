import { EstadoPedidoBadge } from "@/components/pedidos/EstadoPedidoBadge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import type { Pedido } from "@/types/pedido"

interface PedidoDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido: Pedido | null
  mesaNumero: string
}

export function PedidoDetailModal({ open, onOpenChange, pedido, mesaNumero }: PedidoDetailModalProps) {
  if (!pedido) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Pedido #{pedido.id}</DialogTitle>
            <EstadoPedidoBadge estado={pedido.estado} />
          </div>
          <DialogDescription>
            Mesa {mesaNumero}{pedido.empleadoNombre && ` · Atendido por: ${pedido.empleadoNombre}`}
          </DialogDescription>
        </DialogHeader>

        {pedido.items.length ? (
          <ul className="divide-y rounded-md border">
            {pedido.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.productoNombre}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{item.cantidad} × {formatCurrency(item.precioUnitario)}</p>
                </div>
                <span className="shrink-0 text-sm tabular-nums">{formatCurrency(item.cantidad * item.precioUnitario)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">El pedido no tiene ítems.</p>
        )}

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm font-medium">Total</span>
          <span className="text-base font-semibold tabular-nums">{formatCurrency(pedido.total)}</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
