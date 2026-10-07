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
import type { CrearProductoInput } from "@/types/producto"

interface Opcion {
  id: string
  nombre: string
}

interface CrearProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoriasDisponibles: Opcion[]
  onSubmit: (input: CrearProductoInput) => Promise<unknown>
}

export function CrearProductoModal({
  open,
  onOpenChange,
  categoriasDisponibles,
  onSubmit,
}: CrearProductoModalProps) {
  const { pending, error, run } = useAsyncAction()
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  async function handleSubmit() {
    await run(async () => {
      await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        categoriaId,
    })
    setNombre("")
    setDescripcion("")
    setPrecio("")
    setCategoriaId("")
    onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Crear producto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="producto-nombre">Nombre</Label>
          <Input
            id="producto-nombre"
            maxLength={120}
            disabled={pending}
            placeholder="Pizza muzzarella"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="producto-descripcion">Descripción</Label>
          <Input
            id="producto-descripcion"
            maxLength={255}
            disabled={pending}
            placeholder="Pizza grande con muzzarella"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="producto-precio">Precio</Label>
            <Input
              id="producto-precio"
              type="number"
              min="0"
              step="0.01"
              disabled={pending}
              placeholder="8900"
              value={precio}
              onChange={(event) => setPrecio(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="producto-categoria">Categoría</Label>
            <Select disabled={pending} value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger id="producto-categoria" className="w-full">
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

        <p className="text-sm text-muted-foreground">Las recetas se consultan en los productos existentes. Su edición requiere soporte adicional del backend.</p>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={pending || !nombre.trim() || !descripcion.trim() || precio === "" || !Number.isFinite(Number(precio)) || Number(precio) < 0 || !categoriaId}
            onClick={handleSubmit}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
