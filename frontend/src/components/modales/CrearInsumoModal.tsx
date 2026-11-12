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
import type { CreateSupplyInput, UnitOfMeasure } from "@/types/insumo"

const UNITS: UnitOfMeasure[] = ["kg", "litros", "unidades", "gramos", "mililitros"]

interface CrearInsumoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateSupplyInput) => Promise<unknown>
}

export function CrearInsumoModal({
  open,
  onOpenChange,
  onSubmit,
}: CrearInsumoModalProps) {
  const { pending, error, run } = useAsyncAction()
  const [name, setName] = useState("")
  const [stock, setStock] = useState("")
  const [unit, setUnit] = useState<UnitOfMeasure>("kg")

  async function handleSubmit() {
    await run(async () => {
      await onSubmit({ nombre: name.trim(), stock: Number(stock), unidad: unit })
      setName("")
      setStock("")
      setUnit("kg")
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
          <Label htmlFor="supply-name">Nombre</Label>
          <Input
            id="supply-name"
            maxLength={100}
            disabled={pending}
            placeholder="Muzzarella"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="supply-stock">Stock</Label>
            <Input
              id="supply-stock"
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
            <Label htmlFor="supply-unit">Unidad</Label>
            <Select
              disabled={pending}
              value={unit}
              onValueChange={(value) => setUnit(value as UnitOfMeasure)}
            >
              <SelectTrigger id="supply-unit" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((u) => (
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
          <Button disabled={pending || !name.trim() || stock === "" || !Number.isFinite(Number(stock)) || Number(stock) < 0} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
