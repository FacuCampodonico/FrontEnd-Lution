import { useState, type SubmitEvent } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { RecetaEditor } from "@/components/productos/RecetaEditor"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toRecipe, isValidRecipe, type RecipeRow } from "@/lib/receta"
import type { Supply } from "@/types/insumo"
import type { CreateProductInput } from "@/types/producto"

interface CrearProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableCategories: { id: string; nombre: string }[]
  supplies: Supply[]
  loadingSupplies: boolean
  suppliesError: string | null
  onReloadSupplies: () => Promise<unknown>
  onSubmit: (input: CreateProductInput) => Promise<unknown>
}

export function CrearProductoModal({
  open, onOpenChange, availableCategories, supplies, loadingSupplies,
  suppliesError, onReloadSupplies, onSubmit,
}: CrearProductoModalProps) {
  const { pending, error, run, clearError } = useAsyncAction()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [recipe, setRecipe] = useState<RecipeRow[]>([])
  const isValidPrice = price !== "" && Number.isFinite(Number(price)) && Number(price) >= 0
  const isValidForm = name.trim() && description.trim() && isValidPrice && categoryId
    && isValidRecipe(recipe, supplies) && !(recipe.length > 0 && (loadingSupplies || suppliesError))

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidForm) return
    await run(async () => {
      await onSubmit({
        nombre: name.trim(), descripcion: description.trim(), precio: Number(price), categoriaId: categoryId,
        recetas: toRecipe(recipe),
      })
      setName("")
      setDescription("")
      setPrice("")
      setCategoryId("")
      setRecipe([])
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!pending) {
        clearError()
        onOpenChange(value)
      }
    }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl" showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Crear producto</DialogTitle>
          <DialogDescription>Cargá los datos del producto y los insumos de su receta.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-5">
          <fieldset disabled={pending} className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-name">Nombre</Label>
              <Input id="product-name" required maxLength={120} placeholder="Pizza muzzarella"
                value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-description">Descripción</Label>
              <Input id="product-description" required maxLength={255} placeholder="Pizza grande con muzzarella"
                value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="product-price">Precio</Label>
                <Input id="product-price" type="number" required min="0" step="0.01" placeholder="8900"
                  value={price} onChange={(event) => setPrice(event.target.value)} />
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Label htmlFor="product-category">Categoría</Label>
                <Select disabled={pending} value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="product-category" className="w-full min-w-0">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          <RecetaEditor rows={recipe} onChange={setRecipe} supplies={supplies} loadingSupplies={loadingSupplies}
            suppliesError={suppliesError} onReloadSupplies={onReloadSupplies} disabled={pending} />

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={pending} onClick={() => { clearError(); onOpenChange(false) }}>Cancelar</Button>
            <Button type="submit" disabled={pending || !isValidForm}>{pending ? "Guardando…" : "Crear producto"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
