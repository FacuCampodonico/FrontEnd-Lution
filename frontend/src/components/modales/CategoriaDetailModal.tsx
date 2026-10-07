import { useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
          <DialogDescription>Reasignar cambia la categoría del producto y lo retira de la anterior. El PATCH de productos requiere corregir los validadores del backend; actualmente responde 400.</DialogDescription>
        </DialogHeader>
        <Select disabled={pending} value={productoId} onValueChange={setProductoId}>
          <SelectTrigger aria-label="Producto a reasignar"><SelectValue placeholder="Reasignar producto existente" /></SelectTrigger>
          <SelectContent>{disponibles.map((producto) => <SelectItem key={producto.id} value={producto.id}>{producto.nombre} ({producto.categoriaNombre})</SelectItem>)}</SelectContent>
        </Select>
        <Button disabled={pending || !disponibles.some((producto) => producto.id === productoId)} onClick={handleAgregar}>Reasignar producto</Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <p className="text-sm">Productos asignados: {categoria.productoIds.length}</p>
        <ul>{categoria.productoIds.map((id) => <li key={id}>Producto #{id}</li>)}</ul>
        <p className="text-sm text-muted-foreground">El producto requiere una categoría. Para retirarlo, reasignalo desde otra categoría o desde su edición. Dejarlo sin categoría requiere soporte adicional del backend.</p>
      </DialogContent>
    </Dialog>
  )
}
