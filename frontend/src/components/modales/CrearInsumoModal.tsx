import { useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CrearInsumoInput, UnidadMedida } from "@/types/insumo"

const UNIDADES: UnidadMedida[] = ["kg", "litros", "unidades", "gramos", "mililitros"]

interface CrearInsumoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CrearInsumoInput) => Promise<unknown>
}

export function CrearInsumoModal({
  open,
  onOpenChange,
  onSubmit,
}: CrearInsumoModalProps) {
  const { pending, error, run } = useAsyncAction()
  const [nombre, setNombre] = useState("")
  const [stock, setStock] = useState("")
  const [unidad, setUnidad] = useState<UnidadMedida>("kg")

  async function handleSubmit() {
    await run(async () => {
      await onSubmit({ nombre: nombre.trim(), stock: Number(stock), unidad })
      setNombre("")
      setStock("")
      setUnidad("kg")
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Crear insumo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="insumo-nombre">Nombre</Label>
          <Input
            id="insumo-nombre"
            maxLength={100}
            disabled={pending}
            placeholder="Muzzarella"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="insumo-stock">Stock</Label>
            <Input
              id="insumo-stock"
              type="number"
              min="0"
              step="0.01"
              disabled={pending}
              placeholder="12"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="insumo-unidad">Unidad</Label>
            <Select
              disabled={pending}
              value={unidad}
              onValueChange={(value) => setUnidad(value as UnidadMedida)}
            >
              <SelectTrigger id="insumo-unidad" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIDADES.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={pending || !nombre.trim() || stock === "" || !Number.isFinite(Number(stock)) || Number(stock) < 0} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
