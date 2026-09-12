import { useState } from "react"

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

const UNIDADES: UnidadMedida[] = ["kg", "litros", "unidades", "latas", "gramos"]

interface CrearInsumoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CrearInsumoInput) => void
}

export function CrearInsumoModal({
  open,
  onOpenChange,
  onSubmit,
}: CrearInsumoModalProps) {
  const [nombre, setNombre] = useState("")
  const [stock, setStock] = useState("")
  const [unidad, setUnidad] = useState<UnidadMedida>("kg")

  function handleSubmit() {
    onSubmit({ nombre, stock: Number(stock), unidad })
    setNombre("")
    setStock("")
    setUnidad("kg")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear insumo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="insumo-nombre">Nombre</Label>
          <Input
            id="insumo-nombre"
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
              placeholder="12"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Unidad</Label>
            <Select
              value={unidad}
              onValueChange={(value) => setUnidad(value as UnidadMedida)}
            >
              <SelectTrigger className="w-full">
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!nombre || !stock} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
