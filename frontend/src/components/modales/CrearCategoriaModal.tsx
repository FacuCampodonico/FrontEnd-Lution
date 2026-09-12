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
import type { CrearCategoriaInput } from "@/types/categoria"

interface ProductoOpcion {
  id: string
  nombre: string
}

interface CrearCategoriaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productosDisponibles: ProductoOpcion[]
  onSubmit: (input: CrearCategoriaInput) => void
}

export function CrearCategoriaModal({
  open,
  onOpenChange,
  productosDisponibles,
  onSubmit,
}: CrearCategoriaModalProps) {
  const [nombre, setNombre] = useState("")
  const [seleccionados, setSeleccionados] = useState<ProductoOpcion[]>([])

  function agregarProducto(productoId: string) {
    const producto = productosDisponibles.find((p) => p.id === productoId)
    if (!producto || seleccionados.some((p) => p.id === productoId)) return
    setSeleccionados((prev) => [...prev, producto])
  }

  function quitarProducto(nombreProducto: string) {
    setSeleccionados((prev) => prev.filter((p) => p.nombre !== nombreProducto))
  }

  function handleSubmit() {
    onSubmit({ nombre, productoIds: seleccionados.map((p) => p.id) })
    setNombre("")
    setSeleccionados([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear categoría</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoria-nombre">Nombre</Label>
          <Input
            id="categoria-nombre"
            placeholder="Pizzas"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Productos de la categoría</Label>
          <Select onValueChange={agregarProducto}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar productos" />
            </SelectTrigger>
            <SelectContent>
              {productosDisponibles.map((producto) => (
                <SelectItem key={producto.id} value={producto.id}>
                  {producto.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ChipList
            items={seleccionados.map((p) => p.nombre)}
            onRemove={quitarProducto}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!nombre} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
