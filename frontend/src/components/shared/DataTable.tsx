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

type Sort = { header: string; direction: "asc" | "desc" } | null

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No hay resultados todavía.",
}: DataTableProps<T>) {
  const [sort, setSort] = useState<Sort>(null)

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />
  }

  const sortValue = sort && columns.find((column) => column.header === sort.header)?.sortValue
  const rows = sort && sortValue
    ? [...data].sort((a, b) => {
        const valueA = sortValue(a)
        const valueB = sortValue(b)
        const comparison = typeof valueA === "number" && typeof valueB === "number"
          ? valueA - valueB
          : String(valueA).localeCompare(String(valueB), "es", { numeric: true })
        return sort.direction === "asc" ? comparison : -comparison
      })
    : data

  function toggleSort(header: string) {
    setSort((current) => {
      if (current?.header !== header) return { header, direction: "asc" }
      if (current.direction === "asc") return { header, direction: "desc" }
      return null
    })
  }

  return (
    <div className="rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const active = sort?.header === column.header
              const Icon = !active ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown
              return (
                <TableHead
                  key={column.header}
                  className={column.className}
                  aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.header)}
                      className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 hover:text-foreground"
                    >
                      {column.header}
                      <Icon className={active ? "size-3.5" : "size-3.5 opacity-40"} />
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
          {rows.map((row) => (
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
