import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { OrderItem } from "@/types/pedido"

interface SeleccionItemProps {
  item: OrderItem
  disabled: boolean
  onQuantity: (itemId: string, quantity: number) => Promise<unknown>
  onRemove: (itemId: string) => Promise<unknown>
}

export function SeleccionItem({ item, disabled, onQuantity, onRemove }: SeleccionItemProps) {
  return (
    <div className="flex flex-col gap-2 border-b py-2.5 last:border-b-0">
      <div className="flex justify-between gap-3">
        <span className="text-sm">
          {item.productoNombre}{" "}
          <span className="font-mono text-muted-foreground">({formatCurrency(item.precioUnitario)})</span>
        </span>
        <span className="font-mono text-sm">{formatCurrency(item.precioUnitario * item.cantidad)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon-sm" variant="outline" disabled={disabled || item.cantidad <= 1} aria-label={`Reducir cantidad de ${item.productoNombre}`} onClick={() => onQuantity(item.id, item.cantidad - 1)}>−</Button>
        <span aria-label={`Cantidad de ${item.productoNombre}`}>{item.cantidad}</span>
        <Button size="icon-sm" variant="outline" disabled={disabled} aria-label={`Aumentar cantidad de ${item.productoNombre}`} onClick={() => onQuantity(item.id, item.cantidad + 1)}>+</Button>
        <Button size="sm" variant="ghost" disabled={disabled} aria-label={`Quitar ${item.productoNombre}`} onClick={() => onRemove(item.id)}>Quitar</Button>
      </div>
    </div>
  )
}
