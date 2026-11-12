import { useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { Category } from "@/types/categoria"
import type { Product } from "@/types/producto"

interface CategoriaDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  products: Product[]
  onAddProduct: (categoryId: string, productId: string) => Promise<unknown>
}

export function CategoriaDetailModal({ open, onOpenChange, category, products, onAddProduct }: CategoriaDetailModalProps) {
  const [productId, setProductId] = useState("")
  const { pending, error, run } = useAsyncAction()
  if (!category) return null
  const assigned = products.filter((product) => product.categoriaId === category.id)
  const available = products.filter((product) => product.categoriaId !== category.id)

  async function handleAdd() {
    if (!category || !productId) return
    await run(async () => {
      await onAddProduct(category.id, productId)
      setProductId("")
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>{category.nombre}</DialogTitle>
          <DialogDescription>
            {assigned.length === 1 ? "1 producto" : `${assigned.length} productos`} en esta categoría.
          </DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Productos</h3>
          {assigned.length ? (
            <ul className="divide-y rounded-md border">
              {assigned.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{product.nombre}</p>
                    {product.descripcion && <p className="truncate text-xs text-muted-foreground">{product.descripcion}</p>}
                  </div>
                  <span className="shrink-0 text-sm tabular-nums">{formatCurrency(product.precio)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">Todavía no hay productos en esta categoría.</p>
          )}
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Mover un producto a esta categoría</h3>
          <div className="flex gap-2">
            <Select disabled={pending || !available.length} value={productId} onValueChange={setProductId}>
              <SelectTrigger aria-label="Producto a mover" className="min-w-0 flex-1">
                <SelectValue placeholder={available.length ? "Elegir producto" : "No hay otros productos"} />
              </SelectTrigger>
              <SelectContent>{available.map((product) => <SelectItem key={product.id} value={product.id}>{product.nombre} ({product.categoriaNombre})</SelectItem>)}</SelectContent>
            </Select>
            <Button disabled={pending || !available.some((product) => product.id === productId)} onClick={handleAdd}>
              {pending ? "Moviendo…" : "Mover"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">El producto sale de su categoría actual. Todo producto tiene que tener una categoría.</p>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </section>
      </DialogContent>
    </Dialog>
  )
}
