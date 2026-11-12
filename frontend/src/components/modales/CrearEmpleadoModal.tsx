import { useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MIN_PASSWORD_LENGTH } from "@/services/empleados.service"
import type { CreateEmployeeInput, AvailableRole } from "@/types/empleado"

interface CrearEmpleadoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableRoles: AvailableRole[]
  loadingRoles: boolean
  rolesError: string | null
  onReloadRoles: () => Promise<unknown>
  onSubmit: (input: CreateEmployeeInput) => Promise<unknown>
}

export function CrearEmpleadoModal({
  open, onOpenChange, availableRoles, loadingRoles, rolesError, onReloadRoles, onSubmit,
}: CrearEmpleadoModalProps) {
  const [name, setName] = useState("")
  const [dni, setDni] = useState("")
  const [roleId, setRoleId] = useState("")
  const [password, setPassword] = useState("")
  const { pending, error, run } = useAsyncAction()

  async function handleSubmit() {
    await run(async () => {
      await onSubmit({ nombre: name.trim(), dni: dni.trim(), idTipoRol: Number(roleId), password })
      setName("")
      setDni("")
      setRoleId("")
      setPassword("")
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Crear empleado</DialogTitle>
          <DialogDescription>Cargá sus datos, la contraseña con la que va a entrar y su rol.</DialogDescription>
        </DialogHeader>
        <Label htmlFor="employee-name">Nombre completo</Label>
        <Input id="employee-name" maxLength={120} disabled={pending} value={name} onChange={(event) => setName(event.target.value)} />
        <Label htmlFor="employee-dni">DNI</Label>
        <Input id="employee-dni" maxLength={20} disabled={pending} value={dni} onChange={(event) => setDni(event.target.value)} />
        <Label htmlFor="employee-password">Contraseña</Label>
        <Input id="employee-password" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} aria-describedby="employee-password-help" disabled={pending} value={password} onChange={(event) => setPassword(event.target.value)} />
        <p id="employee-password-help" className="text-xs text-muted-foreground">Mínimo {MIN_PASSWORD_LENGTH} caracteres. La usa para iniciar sesión con su DNI.</p>
        <Label htmlFor="employee-role">Rol</Label>
        <Select disabled={pending || loadingRoles || availableRoles.length === 0} value={roleId} onValueChange={setRoleId}>
          <SelectTrigger id="employee-role"><SelectValue placeholder={loadingRoles ? "Cargando roles…" : "Seleccionar rol"} /></SelectTrigger>
          <SelectContent>{availableRoles.map((role) => <SelectItem key={role.id} value={String(role.id)}>{role.nombre}</SelectItem>)}</SelectContent>
        </Select>
        {rolesError ? (
          <div className="flex flex-wrap items-center gap-2">
            <p role="alert" className="text-sm text-destructive">{rolesError}</p>
            <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => onReloadRoles()}>Reintentar</Button>
          </div>
        ) : !loadingRoles && availableRoles.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay roles cargados en la base.</p>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button disabled={pending || !name.trim() || !dni.trim() || password.length < MIN_PASSWORD_LENGTH || !availableRoles.some((role) => String(role.id) === roleId)} onClick={handleSubmit}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
