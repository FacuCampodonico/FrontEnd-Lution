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
import type { CreateTableInput } from "@/types/mesa"

interface CrearMesaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateTableInput) => Promise<unknown>
}

export function CrearMesaModal({
  open,
  onOpenChange,
  onSubmit,
}: CrearMesaModalProps) {
  const { pending, error, run } = useAsyncAction()
  const [number, setNumber] = useState("")

  async function handleSubmit() {
    await run(async () => {
      await onSubmit({ numero: number })
      setNumber("")
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
          <Label htmlFor="table-number">Número</Label>
          <Input
            id="table-number"
            type="number"
            min="1"
            step="1"
            disabled={pending}
            placeholder="09"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={pending || !Number.isSafeInteger(Number(number)) || Number(number) <= 0} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
