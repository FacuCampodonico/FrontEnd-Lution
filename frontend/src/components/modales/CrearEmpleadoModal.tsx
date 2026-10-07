import { useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CrearEmpleadoInput, RolDisponible } from "@/types/empleado"

interface CrearEmpleadoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rolesDisponibles: RolDisponible[]
  onSubmit: (input: CrearEmpleadoInput) => Promise<unknown>
}

export function CrearEmpleadoModal({ open, onOpenChange, rolesDisponibles, onSubmit }: CrearEmpleadoModalProps) {
  const [nombre, setNombre] = useState("")
  const [dni, setDni] = useState("")
  const [rolId, setRolId] = useState("")
  const { pending, error, run } = useAsyncAction()

  async function handleSubmit() {
    await run(async () => {
      await onSubmit({ nombre: nombre.trim(), dni: dni.trim(), idTipoRol: Number(rolId) })
      setNombre("")
      setDni("")
      setRolId("")
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Crear empleado</DialogTitle>
          <DialogDescription>Los roles disponibles provienen de los empleados cargados.</DialogDescription>
        </DialogHeader>
        <Label htmlFor="empleado-nombre">Nombre completo</Label>
        <Input id="empleado-nombre" maxLength={120} disabled={pending} value={nombre} onChange={(event) => setNombre(event.target.value)} />
        <Label htmlFor="empleado-dni">DNI</Label>
        <Input id="empleado-dni" maxLength={20} disabled={pending} value={dni} onChange={(event) => setDni(event.target.value)} />
        <Label htmlFor="empleado-rol">Rol</Label>
        <Select disabled={pending || rolesDisponibles.length === 0} value={rolId} onValueChange={setRolId}>
          <SelectTrigger id="empleado-rol"><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
          <SelectContent>{rolesDisponibles.map((rol) => <SelectItem key={rol.id} value={String(rol.id)}>{rol.nombre}</SelectItem>)}</SelectContent>
        </Select>
        {rolesDisponibles.length === 0 && <p className="text-sm text-muted-foreground">No hay roles disponibles. El backend necesita un endpoint de roles para ofrecer el catálogo completo y crear el primer empleado.</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button disabled={pending || !nombre.trim() || !dni.trim() || !rolesDisponibles.some((rol) => String(rol.id) === rolId)} onClick={handleSubmit}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
