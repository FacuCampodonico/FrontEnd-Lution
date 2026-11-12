import { useState, type SubmitEvent } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { RecetaEditor } from "@/components/productos/RecetaEditor"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toRecipe, rowsFromRecipe, isSameRecipe, isValidRecipe } from "@/lib/receta"
import type { Category } from "@/types/categoria"
import type { Supply } from "@/types/insumo"
import type { UpdateProductInput, Product } from "@/types/producto"

interface EditarProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  categories: Category[]
  supplies: Supply[]
  loadingSupplies: boolean
  suppliesError: string | null
  onReloadSupplies: () => Promise<unknown>
  onSubmit: (id: string, input: UpdateProductInput) => Promise<unknown>
}

export function EditarProductoModal({ open, onOpenChange, product, ...form }: EditarProductoModalProps) {
  const action = useAsyncAction()
  if (!product) return null

  function close() {
    action.clearError()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (action.pending) return
      if (value) onOpenChange(true)
      else close()
    }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl" showCloseButton={!action.pending}>
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Modificá los datos del producto y los insumos de su receta.</DialogDescription>
        </DialogHeader>
        {/* DialogContent unmounts on close: every time it opens it starts with the product's current data. */}
        <EditProductForm product={product} action={action} onClose={close} {...form} />
      </DialogContent>
    </Dialog>
  )
}

interface EditProductFormProps extends Omit<EditarProductoModalProps, "open" | "onOpenChange" | "product"> {
  product: Product
  action: ReturnType<typeof useAsyncAction>
  onClose: () => void
}

function EditProductForm({
  product, action, onClose, categories, supplies, loadingSupplies, suppliesError, onReloadSupplies, onSubmit,
}: EditProductFormProps) {
  const [name, setName] = useState(product.nombre)
  const [description, setDescription] = useState(product.descripcion)
  const [price, setPrice] = useState(String(product.precio))
  const [categoryId, setCategoryId] = useState(product.categoriaId)
  const [recipe, setRecipe] = useState(() => rowsFromRecipe(product.recetas))
  const { pending, error, run } = action

  // The recipe is only sent if it changed: that way the rest can be edited even if supplies fail to load.
  const recipeChanged = !isSameRecipe(product.recetas, toRecipe(recipe))
  const isValidPrice = price !== "" && Number.isFinite(Number(price)) && Number(price) >= 0
  const isValidForm = name.trim() && description.trim() && isValidPrice && categoryId
    && (!recipeChanged || (isValidRecipe(recipe, supplies) && !loadingSupplies && !suppliesError))

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidForm) return
    const ok = await run(() => onSubmit(product.id, {
      nombre: name.trim(), descripcion: description.trim(), precio: Number(price), categoriaId: categoryId,
      recetas: recipeChanged ? toRecipe(recipe) : undefined,
    }))
    if (ok) onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-5">
      <fieldset disabled={pending} className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-name">Nombre</Label>
          <Input id="edit-name" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-description">Descripción</Label>
          <Input id="edit-description" required maxLength={255} value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-price">Precio</Label>
            <Input id="edit-price" type="number" min="0" step="0.01" required value={price} onChange={(event) => setPrice(event.target.value)} />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="edit-category">Categoría</Label>
            <Select disabled={pending} value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="edit-category" className="w-full min-w-0"><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
              <SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      <RecetaEditor rows={recipe} onChange={setRecipe} supplies={supplies} loadingSupplies={loadingSupplies}
        suppliesError={suppliesError} onReloadSupplies={onReloadSupplies} disabled={pending} />

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={pending || !isValidForm}>{pending ? "Guardando…" : "Guardar cambios"}</Button>
      </div>
    </form>
  )
}
