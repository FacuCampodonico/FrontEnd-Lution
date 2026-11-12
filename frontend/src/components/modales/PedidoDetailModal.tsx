import { EstadoPedidoBadge } from "@/components/pedidos/EstadoPedidoBadge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { usePedidoDetalle } from "@/hooks/usePedidoDetalle"
import { formatCurrency } from "@/lib/utils"

interface PedidoDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string | null
  tableNumber: string
}

export function PedidoDetailModal({ open, onOpenChange, orderId, tableNumber }: PedidoDetailModalProps) {
  const { order, loading, error } = usePedidoDetalle(orderId)

  if (!orderId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Pedido #{orderId}</DialogTitle>
            {order && <EstadoPedidoBadge status={order.estado} />}
          </div>
          <DialogDescription>
            Mesa {tableNumber}{order?.empleadoNombre && ` · Atendido por: ${order.empleadoNombre}`}
          </DialogDescription>
        </DialogHeader>

        {loading && <p role="status" className="py-4 text-center text-sm text-muted-foreground">Cargando pedido…</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        {order && (
          <>
            {order.items.length ? (
              <ul className="divide-y rounded-md border">
                {order.items.map((item) => (
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
              <span className="text-base font-semibold tabular-nums">{formatCurrency(order.total)}</span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
