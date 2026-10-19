import { useRef, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { Insumo } from "@/types/insumo"
import type { CrearProductoInput } from "@/types/producto"

interface FilaReceta {
  id: number
  insumoId: string
  cantidad: string
}

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

function cantidadValida(cantidad: string) {
  const numero = Number(cantidad)
  return cantidad !== "" && Number.isFinite(numero) && numero >= 0.001
    && numero <= 9999999.999 && (String(numero).split(".")[1]?.length ?? 0) <= 3
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
  const siguienteId = useRef(0)
  const idsSeleccionados = new Set(recetas.map((receta) => receta.insumoId))
  const insumosDisponibles = insumos.filter((insumo) => !idsSeleccionados.has(insumo.id))
  const recetaValida = recetas.every((receta) =>
    insumos.some((insumo) => insumo.id === receta.insumoId) && cantidadValida(receta.cantidad),
  ) && idsSeleccionados.size === recetas.length
  const precioValido = precio !== "" && Number.isFinite(Number(precio)) && Number(precio) >= 0
  const formularioValido = nombre.trim() && descripcion.trim() && precioValido && categoriaId
    && recetaValida && !(recetas.length > 0 && (cargandoInsumos || errorInsumos))

  function agregarInsumo() {
    const insumo = insumosDisponibles[0]
    if (!insumo) return
    setRecetas((actuales) => [...actuales, {
      id: siguienteId.current++, insumoId: insumo.id, cantidad: "",
    }])
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!formularioValido) return
    await run(async () => {
      await onSubmit({
        nombre: nombre.trim(), descripcion: descripcion.trim(), precio: Number(precio), categoriaId,
        recetas: recetas.map((receta) => ({
          insumoId: receta.insumoId, cantidad: Number(receta.cantidad),
        })),
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

          <fieldset disabled={pending} className="flex min-w-0 flex-col gap-3 border-t pt-4">
            <legend className="sr-only">Receta del producto</legend>
            <div>
              <p className="text-sm font-medium">Receta <span className="font-normal text-muted-foreground">(opcional)</span></p>
              <p id="receta-ayuda" className="mt-1 text-sm text-muted-foreground">
                Indicá cuánto se usa de cada insumo para preparar una unidad del producto. Hasta 3 decimales.
              </p>
            </div>
            {cargandoInsumos ? (
              <p role="status" className="text-sm text-muted-foreground">Cargando insumos…</p>
            ) : errorInsumos ? (
              <div className="flex flex-wrap items-center gap-2">
                <p role="alert" className="text-sm text-destructive">{errorInsumos}</p>
                <Button type="button" variant="outline" disabled={pending} onClick={() => void onRecargarInsumos()}>Reintentar</Button>
              </div>
            ) : insumos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Creá primero los insumos en la sección Insumos para armar la receta.</p>
            ) : recetas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no agregaste insumos a la receta.</p>
            ) : null}

            {recetas.map((receta, index) => {
              const insumo = insumos.find((item) => item.id === receta.insumoId)
              const cantidadInvalida = receta.cantidad !== "" && !cantidadValida(receta.cantidad)
              return (
                <div key={receta.id} className="grid grid-cols-[minmax(0,1fr)_2.75rem] items-start gap-2 rounded-lg border p-3">
                  <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <Label htmlFor={`receta-insumo-${receta.id}`}>Insumo {index + 1}</Label>
                      <Select disabled={pending || cargandoInsumos || !!errorInsumos} value={receta.insumoId}
                        onValueChange={(insumoId) => setRecetas((actuales) => actuales.map((item) =>
                          item.id === receta.id ? { ...item, insumoId, cantidad: "" } : item,
                        ))}>
                        <SelectTrigger id={`receta-insumo-${receta.id}`} className="h-11 w-full min-w-0">
                          <SelectValue placeholder="Seleccionar insumo" />
                        </SelectTrigger>
                        <SelectContent>
                          {insumos.map((item) => (
                            <SelectItem key={item.id} value={item.id}
                              disabled={item.id !== receta.insumoId && idsSeleccionados.has(item.id)}>
                              {item.nombre} ({item.unidad})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <Label htmlFor={`receta-cantidad-${receta.id}`}>Cantidad{insumo ? ` (${insumo.unidad})` : ""}</Label>
                      <Input id={`receta-cantidad-${receta.id}`} className="h-11" type="number" inputMode="decimal"
                        required min="0.001" max="9999999.999" step="0.001" placeholder="Ej.: 0,250"
                        aria-invalid={cantidadInvalida}
                        aria-describedby={cantidadInvalida ? `receta-error-${receta.id}` : "receta-ayuda"}
                        value={receta.cantidad} onChange={(event) => setRecetas((actuales) => actuales.map((item) =>
                          item.id === receta.id ? { ...item, cantidad: event.target.value } : item,
                        ))} />
                      {cantidadInvalida && <p id={`receta-error-${receta.id}`} className="text-xs text-destructive">
                        Usá una cantidad entre 0,001 y 9.999.999,999, con hasta 3 decimales.
                      </p>}
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="mt-5 size-11 text-destructive"
                    aria-label={`Quitar ${insumo?.nombre ?? `insumo ${index + 1}`} de la receta`}
                    onClick={() => setRecetas((actuales) => actuales.filter((item) => item.id !== receta.id))}>
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              )
            })}

            <Button type="button" variant="outline" className="min-h-11 self-start"
              disabled={pending || cargandoInsumos || !!errorInsumos || !insumosDisponibles.length}
              onClick={agregarInsumo}>
              <Plus aria-hidden="true" /> Agregar insumo
            </Button>
          </fieldset>

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
