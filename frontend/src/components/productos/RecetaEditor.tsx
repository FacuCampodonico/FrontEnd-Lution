import { useId, type Dispatch, type SetStateAction } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { isValidQuantity, newRow, type RecipeRow } from "@/lib/receta"
import type { Supply } from "@/types/insumo"

interface RecetaEditorProps {
  rows: RecipeRow[]
  onChange: Dispatch<SetStateAction<RecipeRow[]>>
  supplies: Supply[]
  loadingSupplies: boolean
  suppliesError: string | null
  onReloadSupplies: () => Promise<unknown>
  disabled: boolean
}

export function RecetaEditor({
  rows, onChange, supplies, loadingSupplies, suppliesError, onReloadSupplies, disabled,
}: RecetaEditorProps) {
  const helpId = useId()
  const selectedIds = new Set(rows.map((row) => row.insumoId))
  const availableSupplies = supplies.filter((supply) => !selectedIds.has(supply.id))

  function addSupply() {
    const supply = availableSupplies[0]
    if (!supply) return
    onChange((current) => [...current, newRow(supply.id)])
  }

  return (
    <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-3 border-t pt-4">
      <legend className="sr-only">Receta del producto</legend>
      <div>
        <p className="text-sm font-medium">Receta <span className="font-normal text-muted-foreground">(opcional)</span></p>
        <p id={helpId} className="mt-1 text-sm text-muted-foreground">
          Indicá cuánto se usa de cada insumo para preparar una unidad del producto. Hasta 3 decimales.
        </p>
      </div>
      {loadingSupplies ? (
        <p role="status" className="text-sm text-muted-foreground">Cargando insumos…</p>
      ) : suppliesError ? (
        <div className="flex flex-wrap items-center gap-2">
          <p role="alert" className="text-sm text-destructive">{suppliesError}</p>
          <Button type="button" variant="outline" disabled={disabled} onClick={() => onReloadSupplies()}>Reintentar</Button>
        </div>
      ) : supplies.length === 0 ? (
        <p className="text-sm text-muted-foreground">Creá primero los insumos en la sección Insumos para armar la receta.</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no agregaste insumos a la receta.</p>
      ) : null}

      {rows.map((row, index) => {
        const supply = supplies.find((item) => item.id === row.insumoId)
        const invalidQuantity = row.cantidad !== "" && !isValidQuantity(row.cantidad)
        return (
          <div key={row.id} className="grid grid-cols-[minmax(0,1fr)_2.75rem] items-start gap-2 rounded-lg border p-3">
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
              <div className="flex min-w-0 flex-col gap-1.5">
                <Label htmlFor={`recipe-supply-${row.id}`}>Insumo {index + 1}</Label>
                <Select disabled={disabled || loadingSupplies || !!suppliesError} value={row.insumoId}
                  onValueChange={(insumoId) => onChange((current) => current.map((item) =>
                    item.id === row.id ? { ...item, insumoId, cantidad: "" } : item,
                  ))}>
                  <SelectTrigger id={`recipe-supply-${row.id}`} className="h-11 w-full min-w-0">
                    <SelectValue placeholder="Seleccionar insumo" />
                  </SelectTrigger>
                  <SelectContent>
                    {supplies.map((item) => (
                      <SelectItem key={item.id} value={item.id}
                        disabled={item.id !== row.insumoId && selectedIds.has(item.id)}>
                        {item.nombre} ({item.unidad})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Label htmlFor={`recipe-quantity-${row.id}`}>Cantidad{supply ? ` (${supply.unidad})` : ""}</Label>
                <Input id={`recipe-quantity-${row.id}`} className="h-11" type="number" inputMode="decimal"
                  required min="0.001" max="9999999.999" step="0.001" placeholder="Ej.: 0,250"
                  aria-invalid={invalidQuantity}
                  aria-describedby={invalidQuantity ? `recipe-error-${row.id}` : helpId}
                  value={row.cantidad} onChange={(event) => onChange((current) => current.map((item) =>
                    item.id === row.id ? { ...item, cantidad: event.target.value } : item,
                  ))} />
                {invalidQuantity ? (
                  <p id={`recipe-error-${row.id}`} className="text-xs text-destructive">
                    Usá una cantidad entre 0,001 y 9.999.999,999, con hasta 3 decimales.
                  </p>
                ) : row.cantidad === "" && (
                  <p className="text-xs text-muted-foreground">Falta cargar la cantidad.</p>
                )}
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" className="mt-5 size-11 text-destructive"
              aria-label={`Quitar ${supply?.nombre ?? `insumo ${index + 1}`} de la receta`}
              onClick={() => onChange((current) => current.filter((item) => item.id !== row.id))}>
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        )
      })}

      <Button type="button" variant="outline" className="min-h-11 self-start"
        disabled={disabled || loadingSupplies || !!suppliesError || !availableSupplies.length}
        onClick={addSupply}>
        <Plus aria-hidden="true" /> Agregar insumo
      </Button>
    </fieldset>
  )
}
