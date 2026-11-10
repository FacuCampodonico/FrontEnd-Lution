import { useId, type Dispatch, type SetStateAction } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cantidadValida, nuevaFila, type FilaReceta } from "@/lib/receta"
import type { Insumo } from "@/types/insumo"

interface RecetaEditorProps {
  filas: FilaReceta[]
  onChange: Dispatch<SetStateAction<FilaReceta[]>>
  insumos: Insumo[]
  cargandoInsumos: boolean
  errorInsumos: string | null
  onRecargarInsumos: () => Promise<void>
  disabled: boolean
}

export function RecetaEditor({
  filas, onChange, insumos, cargandoInsumos, errorInsumos, onRecargarInsumos, disabled,
}: RecetaEditorProps) {
  const ayudaId = useId()
  const idsSeleccionados = new Set(filas.map((fila) => fila.insumoId))
  const insumosDisponibles = insumos.filter((insumo) => !idsSeleccionados.has(insumo.id))

  function agregarInsumo() {
    const insumo = insumosDisponibles[0]
    if (!insumo) return
    onChange((actuales) => [...actuales, nuevaFila(insumo.id)])
  }

  return (
    <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-3 border-t pt-4">
      <legend className="sr-only">Receta del producto</legend>
      <div>
        <p className="text-sm font-medium">Receta <span className="font-normal text-muted-foreground">(opcional)</span></p>
        <p id={ayudaId} className="mt-1 text-sm text-muted-foreground">
          Indicá cuánto se usa de cada insumo para preparar una unidad del producto. Hasta 3 decimales.
        </p>
      </div>
      {cargandoInsumos ? (
        <p role="status" className="text-sm text-muted-foreground">Cargando insumos…</p>
      ) : errorInsumos ? (
        <div className="flex flex-wrap items-center gap-2">
          <p role="alert" className="text-sm text-destructive">{errorInsumos}</p>
          <Button type="button" variant="outline" disabled={disabled} onClick={() => void onRecargarInsumos()}>Reintentar</Button>
        </div>
      ) : insumos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Creá primero los insumos en la sección Insumos para armar la receta.</p>
      ) : filas.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no agregaste insumos a la receta.</p>
      ) : null}

      {filas.map((fila, index) => {
        const insumo = insumos.find((item) => item.id === fila.insumoId)
        const cantidadInvalida = fila.cantidad !== "" && !cantidadValida(fila.cantidad)
        return (
          <div key={fila.id} className="grid grid-cols-[minmax(0,1fr)_2.75rem] items-start gap-2 rounded-lg border p-3">
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
              <div className="flex min-w-0 flex-col gap-1.5">
                <Label htmlFor={`receta-insumo-${fila.id}`}>Insumo {index + 1}</Label>
                <Select disabled={disabled || cargandoInsumos || !!errorInsumos} value={fila.insumoId}
                  onValueChange={(insumoId) => onChange((actuales) => actuales.map((item) =>
                    item.id === fila.id ? { ...item, insumoId, cantidad: "" } : item,
                  ))}>
                  <SelectTrigger id={`receta-insumo-${fila.id}`} className="h-11 w-full min-w-0">
                    <SelectValue placeholder="Seleccionar insumo" />
                  </SelectTrigger>
                  <SelectContent>
                    {insumos.map((item) => (
                      <SelectItem key={item.id} value={item.id}
                        disabled={item.id !== fila.insumoId && idsSeleccionados.has(item.id)}>
                        {item.nombre} ({item.unidad})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Label htmlFor={`receta-cantidad-${fila.id}`}>Cantidad{insumo ? ` (${insumo.unidad})` : ""}</Label>
                <Input id={`receta-cantidad-${fila.id}`} className="h-11" type="number" inputMode="decimal"
                  required min="0.001" max="9999999.999" step="0.001" placeholder="Ej.: 0,250"
                  aria-invalid={cantidadInvalida}
                  aria-describedby={cantidadInvalida ? `receta-error-${fila.id}` : ayudaId}
                  value={fila.cantidad} onChange={(event) => onChange((actuales) => actuales.map((item) =>
                    item.id === fila.id ? { ...item, cantidad: event.target.value } : item,
                  ))} />
                {cantidadInvalida ? (
                  <p id={`receta-error-${fila.id}`} className="text-xs text-destructive">
                    Usá una cantidad entre 0,001 y 9.999.999,999, con hasta 3 decimales.
                  </p>
                ) : fila.cantidad === "" && (
                  <p className="text-xs text-muted-foreground">Falta cargar la cantidad.</p>
                )}
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" className="mt-5 size-11 text-destructive"
              aria-label={`Quitar ${insumo?.nombre ?? `insumo ${index + 1}`} de la receta`}
              onClick={() => onChange((actuales) => actuales.filter((item) => item.id !== fila.id))}>
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        )
      })}

      <Button type="button" variant="outline" className="min-h-11 self-start"
        disabled={disabled || cargandoInsumos || !!errorInsumos || !insumosDisponibles.length}
        onClick={agregarInsumo}>
        <Plus aria-hidden="true" /> Agregar insumo
      </Button>
    </fieldset>
  )
}
