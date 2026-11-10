import { useState, type SubmitEvent } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { RecetaEditor } from "@/components/productos/RecetaEditor"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { aReceta, recetaValida, type FilaReceta } from "@/lib/receta"
import type { Insumo } from "@/types/insumo"
import type { CrearProductoInput } from "@/types/producto"

interface CrearProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoriasDisponibles: { id: string; nombre: string }[]
  insumos: Insumo[]
  cargandoInsumos: boolean
  errorInsumos: string | null
  onRecargarInsumos: () => Promise<void>
  onSubmit: (input: CrearProductoInput) => Promise<unknown>
}

export function CrearProductoModal({
  open, onOpenChange, categoriasDisponibles, insumos, cargandoInsumos,
  errorInsumos, onRecargarInsumos, onSubmit,
}: CrearProductoModalProps) {
  const { pending, error, run, clearError } = useAsyncAction()
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [recetas, setRecetas] = useState<FilaReceta[]>([])
  const precioValido = precio !== "" && Number.isFinite(Number(precio)) && Number(precio) >= 0
  const formularioValido = nombre.trim() && descripcion.trim() && precioValido && categoriaId
    && recetaValida(recetas, insumos) && !(recetas.length > 0 && (cargandoInsumos || errorInsumos))

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formularioValido) return
    await run(async () => {
      await onSubmit({
        nombre: nombre.trim(), descripcion: descripcion.trim(), precio: Number(precio), categoriaId,
        recetas: aReceta(recetas),
      })
      setNombre("")
      setDescripcion("")
      setPrecio("")
      setCategoriaId("")
      setRecetas([])
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!pending) {
        clearError()
        onOpenChange(value)
      }
    }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl" showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Crear producto</DialogTitle>
          <DialogDescription>Cargá los datos del producto y los insumos de su receta.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-5">
          <fieldset disabled={pending} className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="producto-nombre">Nombre</Label>
              <Input id="producto-nombre" required maxLength={120} placeholder="Pizza muzzarella"
                value={nombre} onChange={(event) => setNombre(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="producto-descripcion">Descripción</Label>
              <Input id="producto-descripcion" required maxLength={255} placeholder="Pizza grande con muzzarella"
                value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="producto-precio">Precio</Label>
                <Input id="producto-precio" type="number" required min="0" step="0.01" placeholder="8900"
                  value={precio} onChange={(event) => setPrecio(event.target.value)} />
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Label htmlFor="producto-categoria">Categoría</Label>
                <Select disabled={pending} value={categoriaId} onValueChange={setCategoriaId}>
                  <SelectTrigger id="producto-categoria" className="w-full min-w-0">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasDisponibles.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>{categoria.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          <RecetaEditor filas={recetas} onChange={setRecetas} insumos={insumos} cargandoInsumos={cargandoInsumos}
            errorInsumos={errorInsumos} onRecargarInsumos={onRecargarInsumos} disabled={pending} />

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={pending} onClick={() => { clearError(); onOpenChange(false) }}>Cancelar</Button>
            <Button type="submit" disabled={pending || !formularioValido}>{pending ? "Guardando…" : "Crear producto"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
