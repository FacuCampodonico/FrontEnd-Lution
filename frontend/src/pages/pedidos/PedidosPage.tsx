import { useState } from "react"

import { PedidoDetailModal } from "@/components/modales/PedidoDetailModal"
import { EstadoPedidoBadge } from "@/components/pedidos/EstadoPedidoBadge"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmpleados } from "@/hooks/useEmpleados"
import { useMesas } from "@/hooks/useMesas"
import { usePedidos, useOpenOrdersCount } from "@/hooks/usePedidos"
import { formatCurrency } from "@/lib/utils"
import type { OrderStatus, Order } from "@/types/pedido"

const ALL = "all"
const PAGE_SIZE = 10

function itemCount(order: Order) {
  return order.items.reduce((total, item) => total + item.cantidad, 0)
}

export default function PedidosPage() {
  const { tables } = useMesas()
  const { employees } = useEmpleados()
  const openCount = useOpenOrdersCount()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [tableFilter, setTableFilter] = useState(ALL)
  const [employeeFilter, setEmployeeFilter] = useState(ALL)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | typeof ALL>(ALL)
  const [page, setPage] = useState(1)
  const hasFilters = tableFilter !== ALL || employeeFilter !== ALL || statusFilter !== ALL

  const { orders, total, loading, error } = usePedidos({
    mesaId: tableFilter === ALL ? undefined : tableFilter,
    empleadoId: employeeFilter === ALL ? undefined : employeeFilter,
    estado: statusFilter === ALL ? undefined : statusFilter,
    pagina: page,
    limite: PAGE_SIZE,
  })
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const sortedTables = [...tables].sort((a, b) => Number(a.numero) - Number(b.numero))
  const sortedEmployees = [...employees].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))

  // Changing a filter goes back to the first page.
  function filterBy<T>(setFilter: (value: T) => void) {
    return (value: T) => {
      setFilter(value)
      setPage(1)
    }
  }

  function clearFilters() {
    setTableFilter(ALL)
    setEmployeeFilter(ALL)
    setStatusFilter(ALL)
    setPage(1)
  }

  function getTableNumber(tableId: string) {
    return tables.find((t) => t.id === tableId)?.numero ?? tableId
  }

  function handleViewOrder(order: Order) {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  const columns: DataTableColumn<Order>[] = [
    { header: "Pedido", cell: (o) => <span className="font-mono">#{o.id}</span> },
    { header: "Mesa", cell: (o) => `Mesa ${getTableNumber(o.mesaId)}` },
    { header: "Empleado", cell: (o) => o.empleadoNombre ?? "Sin información" },
    { header: "Ítems", cell: (o) => itemCount(o) },
    { header: "Total", cell: (o) => formatCurrency(o.total) },
    { header: "Estado", cell: (o) => <EstadoPedidoBadge status={o.estado} /> },
    {
      header: "Acciones",
      cell: (o) => (
        <Button variant="outline" size="sm" onClick={() => handleViewOrder(o)}>
          Ver detalle
        </Button>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Pedidos"
        subtitle={openCount === null ? undefined : `${openCount} abiertos`}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando pedidos…</p>}
        {error && <p role="alert">{error}</p>}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Select value={tableFilter} onValueChange={filterBy(setTableFilter)}>
            <SelectTrigger aria-label="Filtrar por mesa" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas las mesas</SelectItem>
              {sortedTables.map((t) => <SelectItem key={t.id} value={t.id}>Mesa {t.numero}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={employeeFilter} onValueChange={filterBy(setEmployeeFilter)}>
            <SelectTrigger aria-label="Filtrar por empleado" className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los empleados</SelectItem>
              {sortedEmployees.map((e) => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => filterBy(setStatusFilter)(value as OrderStatus | typeof ALL)}>
            <SelectTrigger aria-label="Filtrar por estado" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los estados</SelectItem>
              <SelectItem value="abierto">Abiertos</SelectItem>
              <SelectItem value="pagado">Pagados</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>Limpiar filtros</Button>
          )}
          <span className="font-mono text-xs text-muted-foreground">{total} pedidos</span>
        </div>
        <DataTable
          columns={columns}
          data={orders}
          getRowKey={(o) => o.id}
          emptyMessage={hasFilters ? "No hay pedidos que coincidan con los filtros." : "Todavía no hay pedidos."}
        />
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <span className="font-mono text-xs text-muted-foreground">Página {page} de {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}>
              Siguiente
            </Button>
          </div>
        )}
      </div>

      <PedidoDetailModal
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open)
          if (!open) setSelectedOrder(null)
        }}
        orderId={selectedOrder?.id ?? null}
        tableNumber={selectedOrder ? getTableNumber(selectedOrder.mesaId) : ""}
      />
    </div>
  )
}
