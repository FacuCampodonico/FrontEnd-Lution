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
import type { CrearEmpleadoInput, RolEmpleado } from "@/types/empleado"

interface CrearEmpleadoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CrearEmpleadoInput) => void
}

export function CrearEmpleadoModal({
  open,
  onOpenChange,
  onSubmit,
}: CrearEmpleadoModalProps) {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [rol, setRol] = useState<RolEmpleado>("mozo")

  function handleSubmit() {
    onSubmit({ nombre, apellido, rol })
    setNombre("")
    setApellido("")
    setRol("mozo")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear empleado</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="empleado-nombre">Nombre</Label>
            <Input
              id="empleado-nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="empleado-apellido">Apellido</Label>
            <Input
              id="empleado-apellido"
              value={apellido}
              onChange={(event) => setApellido(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Rol</Label>
          <Select value={rol} onValueChange={(value) => setRol(value as RolEmpleado)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mozo">Mozo</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!nombre || !apellido} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
