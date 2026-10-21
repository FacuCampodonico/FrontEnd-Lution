import { useState, type SubmitEvent } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { RecetaEditor } from "@/components/productos/RecetaEditor"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aReceta, filasDesdeReceta, mismaReceta, recetaValida } from "@/lib/receta"
import type { Categoria } from "@/types/categoria"
import type { Insumo } from "@/types/insumo"
import type { ActualizarProductoInput, Producto } from "@/types/producto"

interface EditarProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: Producto | null
  categorias: Categoria[]
  insumos: Insumo[]
  cargandoInsumos: boolean
  errorInsumos: string | null
  onRecargarInsumos: () => Promise<void>
  onSubmit: (id: string, input: ActualizarProductoInput) => Promise<unknown>
}

export function EditarProductoModal({ open, onOpenChange, producto, ...formulario }: EditarProductoModalProps) {
  const accion = useAsyncAction()
  if (!producto) return null

  function cerrar() {
    accion.clearError()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (accion.pending) return
      if (value) onOpenChange(true)
      else cerrar()
    }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl" showCloseButton={!accion.pending}>
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Modificá los datos del producto y los insumos de su receta.</DialogDescription>
        </DialogHeader>
        {/* DialogContent se desmonta al cerrar: cada apertura arranca con los datos actuales del producto. */}
        <FormularioEditarProducto producto={producto} accion={accion} onCerrar={cerrar} {...formulario} />
      </DialogContent>
    </Dialog>
  )
}

interface FormularioEditarProductoProps extends Omit<EditarProductoModalProps, "open" | "onOpenChange" | "producto"> {
  producto: Producto
  accion: ReturnType<typeof useAsyncAction>
  onCerrar: () => void
}

function FormularioEditarProducto({
  producto, accion, onCerrar, categorias, insumos, cargandoInsumos, errorInsumos, onRecargarInsumos, onSubmit,
}: FormularioEditarProductoProps) {
  const [nombre, setNombre] = useState(producto.nombre)
  const [descripcion, setDescripcion] = useState(producto.descripcion)
  const [precio, setPrecio] = useState(String(producto.precio))
  const [categoriaId, setCategoriaId] = useState(producto.categoriaId)
  const [recetas, setRecetas] = useState(() => filasDesdeReceta(producto.recetas))
  const { pending, error, run } = accion

  // Solo se manda la receta si cambió: así se puede editar el resto aunque fallen los insumos.
  const recetaModificada = !mismaReceta(producto.recetas, aReceta(recetas))
  const precioValido = precio !== "" && Number.isFinite(Number(precio)) && Number(precio) >= 0
  const formularioValido = nombre.trim() && descripcion.trim() && precioValido && categoriaId
    && (!recetaModificada || (recetaValida(recetas, insumos) && !cargandoInsumos && !errorInsumos))

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formularioValido) return
    const ok = await run(() => onSubmit(producto.id, {
      nombre: nombre.trim(), descripcion: descripcion.trim(), precio: Number(precio), categoriaId,
      recetas: recetaModificada ? aReceta(recetas) : undefined,
    }))
    if (ok) onCerrar()
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-5">
      <fieldset disabled={pending} className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-nombre">Nombre</Label>
          <Input id="edit-nombre" required maxLength={120} value={nombre} onChange={(event) => setNombre(event.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-descripcion">Descripción</Label>
          <Input id="edit-descripcion" required maxLength={255} value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-precio">Precio</Label>
            <Input id="edit-precio" type="number" min="0" step="0.01" required value={precio} onChange={(event) => setPrecio(event.target.value)} />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="edit-categoria">Categoría</Label>
            <Select disabled={pending} value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger id="edit-categoria" className="w-full min-w-0"><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
              <SelectContent>{categorias.map((categoria) => <SelectItem key={categoria.id} value={categoria.id}>{categoria.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      <RecetaEditor filas={recetas} onChange={setRecetas} insumos={insumos} cargandoInsumos={cargandoInsumos}
        errorInsumos={errorInsumos} onRecargarInsumos={onRecargarInsumos} disabled={pending} />

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={pending} onClick={onCerrar}>Cancelar</Button>
        <Button type="submit" disabled={pending || !formularioValido}>{pending ? "Guardando…" : "Guardar cambios"}</Button>
      </div>
    </form>
  )
}
