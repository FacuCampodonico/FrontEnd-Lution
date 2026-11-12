import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types/producto"

interface CatalogoProductoItemProps {
  product: Product
  disabled?: boolean
  onAdd: (product: Product) => Promise<unknown>
}

export function CatalogoProductoItem({
  product,
  onAdd,
  disabled,
}: CatalogoProductoItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{product.nombre}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {product.categoriaNombre}
        </span>
      </div>
      <div className="flex items-center gap-3.5">
        <span className="font-mono text-sm font-medium">
          {formatCurrency(product.precio)}
        </span>
        <Button
          size="icon-sm"
          variant="secondary"
          disabled={disabled}
          onClick={() => onAdd(product)}
          aria-label={`Agregar ${product.nombre}`}
        >
          +
        </Button>
      </div>
    </div>
  )
}
