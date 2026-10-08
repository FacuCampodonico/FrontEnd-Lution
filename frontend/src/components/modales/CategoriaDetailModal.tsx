import { useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { Categoria } from "@/types/categoria"
import type { Producto } from "@/types/producto"

interface CategoriaDetalleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoria: Categoria | null
  productos: Producto[]
  onAddProducto: (categoriaId: string, productoId: string) => Promise<unknown>
}

export function CategoriaDetailModal({ open, onOpenChange, categoria, productos, onAddProducto }: CategoriaDetalleModalProps) {
  const [productoId, setProductoId] = useState("")
  const { pending, error, run } = useAsyncAction()
  if (!categoria) return null
  const asignados = productos.filter((producto) => producto.categoriaId === categoria.id)
  const disponibles = productos.filter((producto) => producto.categoriaId !== categoria.id)

  async function handleAgregar() {
    if (!categoria || !productoId) return
    await run(async () => {
      await onAddProducto(categoria.id, productoId)
      setProductoId("")
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>{categoria.nombre}</DialogTitle>
          <DialogDescription>
            {asignados.length === 1 ? "1 producto" : `${asignados.length} productos`} en esta categoría.
          </DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Productos</h3>
          {asignados.length ? (
            <ul className="divide-y rounded-md border">
              {asignados.map((producto) => (
                <li key={producto.id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{producto.nombre}</p>
                    {producto.descripcion && <p className="truncate text-xs text-muted-foreground">{producto.descripcion}</p>}
                  </div>
                  <span className="shrink-0 text-sm tabular-nums">{formatCurrency(producto.precio)}</span>
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
            <Select disabled={pending || !disponibles.length} value={productoId} onValueChange={setProductoId}>
              <SelectTrigger aria-label="Producto a mover" className="min-w-0 flex-1">
                <SelectValue placeholder={disponibles.length ? "Elegir producto" : "No hay otros productos"} />
              </SelectTrigger>
              <SelectContent>{disponibles.map((producto) => <SelectItem key={producto.id} value={producto.id}>{producto.nombre} ({producto.categoriaNombre})</SelectItem>)}</SelectContent>
            </Select>
            <Button disabled={pending || !disponibles.some((producto) => producto.id === productoId)} onClick={handleAgregar}>
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
