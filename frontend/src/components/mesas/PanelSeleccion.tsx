import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { SeleccionItem } from "@/components/mesas/SeleccionItem"
import { formatCurrency } from "@/lib/utils"
import type { PedidoItem } from "@/types/pedido"

interface PanelSeleccionProps {
  items: PedidoItem[]
  total: number
  pedidoCreado: boolean
  onCrearPedido: () => void
  onPagar: () => void
}

export function PanelSeleccion({
  items,
  total,
  pedidoCreado,
  onCrearPedido,
  onPagar,
}: PanelSeleccionProps) {
  return (
    <aside className="flex w-[400px] shrink-0 flex-col gap-3.5 border-l bg-background p-6">
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Selección
      </h2>

      {items.length === 0 ? (
        <EmptyState title="Agregá productos del catálogo." />
      ) : (
        <div className="flex flex-col">
          {items.map((item) => (
            <SeleccionItem key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3.5">
        <div className="flex items-baseline justify-between border-t pt-3.5">
          <span className="text-sm font-semibold">Total</span>
          <span className="font-mono text-2xl font-medium tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            disabled={items.length === 0}
            onClick={onCrearPedido}
          >
            Crear pedido
          </Button>
          <Button
            size="lg"
            variant="secondary"
            disabled={!pedidoCreado}
            onClick={onPagar}
          >
            Pagar
          </Button>
          {!pedidoCreado && (
            <p className="text-center font-mono text-xs text-muted-foreground">
              Pagar se habilita al crear el pedido
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
