import { useState } from "react"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Categoria } from "@/types/categoria"
import type { Producto } from "@/types/producto"

interface CategoriaDetalleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoria: Categoria | null
  productos?: Producto[]
  onRemoveProducto?: (categoriaId: string, productoId: string) => void
  onAddProducto?: (categoriaId: string, productoId: string) => void
}

export function CategoriaDetailModal({
  open,
  onOpenChange,
  categoria,
  productos = [],
  onRemoveProducto,
  onAddProducto,
}: CategoriaDetalleModalProps) {
  const [productoAAgregar, setProductoAAgregar] = useState<string>("")

  if (!categoria) return null

  const productosSeguros = Array.isArray(productos) ? productos : []
  const idsAsignados = Array.isArray(categoria.productoIds) ? categoria.productoIds : []

  const productosDeCategoria = productosSeguros.filter((prod) =>
    idsAsignados.includes(prod.id)
  )

  const productosDisponibles = productosSeguros.filter(
    (prod) => !idsAsignados.includes(prod.id)
  )

  const handleAgregar = () => {
    if (!productoAAgregar || !onAddProducto) return
    onAddProducto(categoria.id, productoAAgregar)
    setProductoAAgregar("")
  }

  const handleRemover = (productoId: string) => {
    if (!onRemoveProducto) return
    onRemoveProducto(categoria.id, productoId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {categoria.nombre}
          </DialogTitle>
        </DialogHeader>

        {productosDisponibles.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <Select value={productoAAgregar} onValueChange={setProductoAAgregar}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Agregar producto existente..." />
              </SelectTrigger>
              <SelectContent>
                {productosDisponibles.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id}>
                    {prod.nombre} (${prod.precio})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              size="sm"
              onClick={handleAgregar}
              disabled={!productoAAgregar}
              className="flex items-center gap-1 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Productos asignados ({productosDeCategoria.length}):
          </h4>

          {productosDeCategoria.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-2">
              No hay productos cargados en esta categoría.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {productosDeCategoria.map((producto) => (
                <li
                  key={producto.id}
                  className="py-2 flex justify-between items-center text-sm"
                >
                  <span className="font-medium text-gray-800">
                    {producto.nombre}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-semibold">
                      ${producto.precio}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemover(producto.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}