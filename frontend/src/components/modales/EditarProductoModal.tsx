import { useEffect, useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Categoria } from "@/types/categoria"
import type { Insumo } from "@/types/insumo"
import type { ActualizarProductoInput, Producto } from "@/types/producto"

interface EditarProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: Producto | null
  categorias: Categoria[]
  insumos: Insumo[]
  onSubmit: (id: string, input: ActualizarProductoInput) => Promise<unknown>
}

export function EditarProductoModal({ open, onOpenChange, producto, categorias, insumos, onSubmit }: EditarProductoModalProps) {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const { pending, error, run } = useAsyncAction()

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre)
      setDescripcion(producto.descripcion)
      setPrecio(String(producto.precio))
      setCategoriaId(producto.categoriaId)
    }
  }, [producto])

  if (!producto) return null

  const precioValido = precio !== "" && Number.isFinite(Number(precio)) && Number(precio) >= 0

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!producto) return
    await run(async () => {
      await onSubmit(producto.id, { nombre: nombre.trim(), descripcion: descripcion.trim(), precio: Number(precio), categoriaId })
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Modificá el nombre, la descripción, el precio o la categoría del producto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <fieldset disabled={pending} className="flex flex-col gap-3">
            <Label htmlFor="edit-nombre">Nombre</Label>
            <Input id="edit-nombre" required maxLength={120} value={nombre} onChange={(event) => setNombre(event.target.value)} />
            <Label htmlFor="edit-descripcion">Descripción</Label>
            <Input id="edit-descripcion" required maxLength={255} value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />
            <Label htmlFor="edit-precio">Precio</Label>
            <Input id="edit-precio" type="number" min="0" step="0.01" required value={precio} onChange={(event) => setPrecio(event.target.value)} />
            <Label htmlFor="edit-categoria">Categoría</Label>
            <Select disabled={pending} value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger id="edit-categoria"><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
              <SelectContent>{categorias.map((categoria) => <SelectItem key={categoria.id} value={categoria.id}>{categoria.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </fieldset>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Receta</p>
            {producto.insumoIds.length ? (
              <ul className="flex flex-wrap gap-1.5">
                {producto.insumoIds.map((id) => (
                  <li key={id} className="rounded-full border bg-muted px-2.5 py-0.5 text-xs">
                    {insumos.find((insumo) => insumo.id === id)?.nombre ?? "Cargando…"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sin insumos.</p>
            )}
            <p className="text-xs text-muted-foreground">La receta no se puede editar desde acá.</p>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={pending || !nombre.trim() || !descripcion.trim() || !precioValido || !categoriaId}>Guardar cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
