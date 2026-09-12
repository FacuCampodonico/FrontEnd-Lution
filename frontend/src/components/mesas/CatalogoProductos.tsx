import { CatalogoProductoItem } from "@/components/mesas/CatalogoProductoItem"
import { EmptyState } from "@/components/shared/EmptyState"
import type { Producto } from "@/types/producto"

interface CatalogoProductosProps {
  productos: Producto[]
  onAgregar: (producto: Producto) => void
}

export function CatalogoProductos({
  productos,
  onAgregar,
}: CatalogoProductosProps) {
  return (
    <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-7">
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Productos
      </h2>
      {productos.length === 0 ? (
        <EmptyState title="Todavía no hay productos cargados." />
      ) : (
        <div className="rounded-xl border bg-background">
          {productos.map((producto) => (
            <CatalogoProductoItem
              key={producto.id}
              producto={producto}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      )}
    </div>
  )
}
