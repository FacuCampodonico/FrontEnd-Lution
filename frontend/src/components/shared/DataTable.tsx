import { useState, type ReactNode } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/EmptyState"

export interface DataTableColumn<T> {
  header: string
  cell: (row: T) => ReactNode
  className?: string
  sortValue?: (row: T) => string | number
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string
  emptyMessage?: string
}

type Orden = { header: string; direccion: "asc" | "desc" } | null

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No hay resultados todavía.",
}: DataTableProps<T>) {
  const [orden, setOrden] = useState<Orden>(null)

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />
  }

  const sortValue = orden && columns.find((column) => column.header === orden.header)?.sortValue
  const filas = orden && sortValue
    ? [...data].sort((a, b) => {
        const valorA = sortValue(a)
        const valorB = sortValue(b)
        const comparacion = typeof valorA === "number" && typeof valorB === "number"
          ? valorA - valorB
          : String(valorA).localeCompare(String(valorB), "es", { numeric: true })
        return orden.direccion === "asc" ? comparacion : -comparacion
      })
    : data

  function cambiarOrden(header: string) {
    setOrden((actual) => {
      if (actual?.header !== header) return { header, direccion: "asc" }
      if (actual.direccion === "asc") return { header, direccion: "desc" }
      return null
    })
  }

  return (
    <div className="rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const activa = orden?.header === column.header
              const Icono = !activa ? ArrowUpDown : orden.direccion === "asc" ? ArrowUp : ArrowDown
              return (
                <TableHead
                  key={column.header}
                  className={column.className}
                  aria-sort={activa ? (orden.direccion === "asc" ? "ascending" : "descending") : undefined}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => cambiarOrden(column.header)}
                      className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 hover:text-foreground"
                    >
                      {column.header}
                      <Icono className={activa ? "size-3.5" : "size-3.5 opacity-40"} />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((row) => (
            <TableRow key={getRowKey(row)}>
              {columns.map((column) => (
                <TableCell key={column.header} className={column.className}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
