import { CatalogoProductoItem } from "@/components/mesas/CatalogoProductoItem"
import { EmptyState } from "@/components/shared/EmptyState"
import type { Product } from "@/types/producto"

interface CatalogoProductosProps {
  products: Product[]
  disabled?: boolean
  onAdd: (product: Product) => Promise<unknown>
}

export function CatalogoProductos({
  products,
  onAdd,
  disabled,
}: CatalogoProductosProps) {
  return (
    <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-7">
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Productos
      </h2>
      {products.length === 0 ? (
        <EmptyState title="Todavía no hay productos cargados." />
      ) : (
        <div className="rounded-xl border bg-background">
          {products.map((product) => (
            <CatalogoProductoItem
              key={product.id}
              product={product}
              disabled={disabled}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  )
}
