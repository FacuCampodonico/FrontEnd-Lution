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
import { ChipList } from "@/components/shared/ChipList"
import type { CrearProductoInput } from "@/types/producto"

interface Opcion {
  id: string
  nombre: string
}

interface CrearProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoriasDisponibles: Opcion[]
  insumosDisponibles: Opcion[]
  onSubmit: (input: CrearProductoInput) => void
}

export function CrearProductoModal({
  open,
  onOpenChange,
  categoriasDisponibles,
  insumosDisponibles,
  onSubmit,
}: CrearProductoModalProps) {
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [insumos, setInsumos] = useState<Opcion[]>([])

  function agregarInsumo(insumoId: string) {
    const insumo = insumosDisponibles.find((i) => i.id === insumoId)
    if (!insumo || insumos.some((i) => i.id === insumoId)) return
    setInsumos((prev) => [...prev, insumo])
  }

  function quitarInsumo(nombreInsumo: string) {
    setInsumos((prev) => prev.filter((i) => i.nombre !== nombreInsumo))
  }

  function handleSubmit() {
    onSubmit({
      nombre,
      precio: Number(precio),
      categoriaId,
      insumoIds: insumos.map((i) => i.id),
    })
    setNombre("")
    setPrecio("")
    setCategoriaId("")
    setInsumos([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear producto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="producto-nombre">Nombre</Label>
          <Input
            id="producto-nombre"
            placeholder="Pizza muzzarella"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="producto-precio">Precio</Label>
            <Input
              id="producto-precio"
              type="number"
              placeholder="8900"
              value={precio}
              onChange={(event) => setPrecio(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Categoría</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {categoriasDisponibles.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Insumos</Label>
          <Select onValueChange={agregarInsumo}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar insumos" />
            </SelectTrigger>
            <SelectContent>
              {insumosDisponibles.map((insumo) => (
                <SelectItem key={insumo.id} value={insumo.id}>
                  {insumo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ChipList items={insumos.map((i) => i.nombre)} onRemove={quitarInsumo} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!nombre || !precio || !categoriaId}
            onClick={handleSubmit}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
