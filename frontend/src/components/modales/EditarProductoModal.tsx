import { useEffect, useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { Categoria } from "@/types/categoria"
import type { ActualizarProductoInput, Producto } from "@/types/producto"

interface EditarProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: Producto | null
  categorias: Categoria[]
  onSubmit: (id: string, input: ActualizarProductoInput) => Promise<unknown>
}

export function EditarProductoModal({ open, onOpenChange, producto, categorias, onSubmit }: EditarProductoModalProps) {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const { pending, error, run } = useAsyncAction()

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre)
      setDescripcion(producto.descripcion)
      setCategoriaId(producto.categoriaId)
    }
  }, [producto])

  if (!producto) return null

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!producto) return
    await run(async () => {
      await onSubmit(producto.id, { nombre: nombre.trim(), descripcion: descripcion.trim(), categoriaId })
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>La actualización está conectada al backend. Actualmente rechaza los cambios con 400 por falta de validadores en su DTO.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <fieldset disabled={pending} className="flex flex-col gap-3">
            <Label htmlFor="edit-nombre">Nombre</Label>
            <Input id="edit-nombre" required maxLength={120} value={nombre} onChange={(event) => setNombre(event.target.value)} />
            <Label htmlFor="edit-descripcion">Descripción</Label>
            <Input id="edit-descripcion" required maxLength={255} value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />
            <Label htmlFor="edit-categoria">Categoría</Label>
            <Select disabled={pending} value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger id="edit-categoria"><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
              <SelectContent>{categorias.map((categoria) => <SelectItem key={categoria.id} value={categoria.id}>{categoria.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </fieldset>
          <p className="text-sm">Precio: {formatCurrency(producto.precio)}. Su actualización requiere soporte adicional del backend.</p>
          <p className="text-sm">Receta (solo consulta): {producto.insumoIds.length ? producto.insumoIds.map((id) => `Insumo #${id}`).join(", ") : "Sin insumos"}. El CRUD de productos no permite modificarla.</p>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={pending || !nombre.trim() || !descripcion.trim() || !categoriaId}>Guardar cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
