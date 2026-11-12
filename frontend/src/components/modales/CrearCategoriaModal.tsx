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
import type { CreateCategoryInput } from "@/types/categoria"

interface CrearCategoriaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateCategoryInput) => Promise<unknown>
}

export function CrearCategoriaModal({
  open,
  onOpenChange,
  onSubmit,
}: CrearCategoriaModalProps) {
  const { pending, error, run } = useAsyncAction()
  const [name, setName] = useState("")
  async function handleSubmit() {
    await run(async () => {
      await onSubmit({ nombre: name.trim() })
      setName("")
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !pending && onOpenChange(value)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Crear categoría</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category-name">Nombre</Label>
          <Input
            id="category-name"
            maxLength={100}
            disabled={pending}
            placeholder="Pizzas"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={pending || !name.trim()} onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
