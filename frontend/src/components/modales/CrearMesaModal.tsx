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
import type { CrearMesaInput } from "@/types/mesa"

interface CrearMesaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CrearMesaInput) => Promise<unknown>
}

export function CrearMesaModal({
  open,
  onOpenChange,
  onSubmit,
}: CrearMesaModalProps) {
  const { pending, error, run } = useAsyncAction()
  const [numero, setNumero] = useState("")

  async function handleSubmit() {
    await run(async () => {
      await onSubmit({ numero })
      setNumero("")
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Crear mesa</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mesa-numero">Número</Label>
          <Input
            id="mesa-numero"
            type="number"
            min="1"
            step="1"
            disabled={pending}
            placeholder="09"
            value={numero}
            onChange={(event) => setNumero(event.target.value)}
          />
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={pending || !Number.isSafeInteger(Number(numero)) || Number(numero) <= 0} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
