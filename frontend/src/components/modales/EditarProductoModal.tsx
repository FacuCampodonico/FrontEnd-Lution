import { useEffect, useState } from "react"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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
import type { Categoria } from "@/types/categoria"
import type { Producto } from "@/types/producto"

interface EditarProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: Producto | null
  categorias?: Categoria[]
  insumosDisponibles?: { id: string; nombre: string }[]
  onSubmit: (id: string, datosActualizados: Partial<Producto>) => void
}

export function EditarProductoModal({
  open,
  onOpenChange,
  producto,
  categorias = [],
  insumosDisponibles = [],
  onSubmit,
}: EditarProductoModalProps) {
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [insumoIdsSeleccionados, setInsumoIdsSeleccionados] = useState<string[]>([])
  const [insumoAAgregar, setInsumoAAgregar] = useState<string>("")

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || "")
      setPrecio(String(producto.precio || ""))
      setCategoriaId(producto.categoriaId || "")
      setInsumoIdsSeleccionados(Array.isArray(producto.insumoIds) ? producto.insumoIds : [])
      setInsumoAAgregar("")
    }
  }, [producto])

  const insumosParaAgregar = insumosDisponibles.filter(
    (ins) => !insumoIdsSeleccionados.includes(ins.id)
  )

  const handleAgregarInsumo = () => {
    if (!insumoAAgregar) return
    setInsumoIdsSeleccionados((prev) => [...prev, insumoAAgregar])
    setInsumoAAgregar("")
  }

  const handleRemoverInsumo = (idRemover: string) => {
    setInsumoIdsSeleccionados((prev) => prev.filter((id) => id !== idRemover))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!producto) return

    onSubmit(producto.id, {
      nombre,
      precio: Number(precio),
      categoriaId: categoriaId || undefined,
      insumoIds: insumoIdsSeleccionados,
    })

    onOpenChange(false)
  }

  if (!producto) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Producto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-nombre">Nombre</Label>
            <Input
              id="edit-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-precio">Precio</Label>
            <Input
              id="edit-precio"
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>

          {categorias.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label>Categoría</Label>
              <Select value={categoriaId} onValueChange={setCategoriaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Insumos / Ingredientes ({insumoIdsSeleccionados.length})</Label>

            {insumosParaAgregar.length > 0 && (
              <div className="flex items-center gap-2">
                <Select value={insumoAAgregar} onValueChange={setInsumoAAgregar}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Agregar insumo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {insumosParaAgregar.map((ins) => (
                      <SelectItem key={ins.id} value={ins.id}>
                        {ins.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleAgregarInsumo}
                  disabled={!insumoAAgregar}
                  className="flex items-center gap-1 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
            )}

            {insumoIdsSeleccionados.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-1">
                Sin insumos asignados.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-36 overflow-y-auto border rounded-md p-2 mt-1">
                {insumoIdsSeleccionados.map((id) => {
                  const insumoObj = insumosDisponibles.find((i) => i.id === id)
                  return (
                    <li
                      key={id}
                      className="py-1 flex justify-between items-center text-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {insumoObj ? insumoObj.nombre : `Insumo (${id})`}
                      </span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoverInsumo(id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}