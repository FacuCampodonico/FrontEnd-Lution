import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Producto } from "@/types/producto"

interface CatalogoProductoItemProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

export function CatalogoProductoItem({
  producto,
  onAgregar,
}: CatalogoProductoItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{producto.nombre}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {producto.categoriaNombre}
        </span>
      </div>
      <div className="flex items-center gap-3.5">
        <span className="font-mono text-sm font-medium">
          {formatCurrency(producto.precio)}
        </span>
        <Button
          size="icon-sm"
          variant="secondary"
          onClick={() => onAgregar(producto)}
          aria-label={`Agregar ${producto.nombre}`}
        >
          +
        </Button>
      </div>
    </div>
  )
}
