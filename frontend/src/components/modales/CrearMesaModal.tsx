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
import type { CrearMesaInput } from "@/types/mesa"

interface CrearMesaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CrearMesaInput) => void
}

export function CrearMesaModal({
  open,
  onOpenChange,
  onSubmit,
}: CrearMesaModalProps) {
  const [numero, setNumero] = useState("")

  function handleSubmit() {
    onSubmit({ numero })
    setNumero("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear mesa</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mesa-numero">Número</Label>
          <Input
            id="mesa-numero"
            placeholder="09"
            value={numero}
            onChange={(event) => setNumero(event.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!numero} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
