import { useState } from "react"

import { PedidoDetailModal } from "@/components/modales/PedidoDetailModal"
import { EstadoPedidoBadge } from "@/components/pedidos/EstadoPedidoBadge"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMesas } from "@/hooks/useMesas"
import { usePedidos } from "@/hooks/usePedidos"
import { formatCurrency } from "@/lib/utils"
import type { EstadoPedido, Pedido } from "@/types/pedido"

const TODOS = "todos"

function cantidadItems(pedido: Pedido) {
  return pedido.items.reduce((total, item) => total + item.cantidad, 0)
}

export default function PedidosPage() {
  const { pedidos, loading, error } = usePedidos()
  const { mesas } = useMesas()

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)
  const [detalleAbierto, setDetalleAbierto] = useState(false)

  const [filtroMesa, setFiltroMesa] = useState(TODOS)
  const [filtroEmpleado, setFiltroEmpleado] = useState(TODOS)
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | typeof TODOS>(TODOS)
  const hayFiltros = filtroMesa !== TODOS || filtroEmpleado !== TODOS || filtroEstado !== TODOS

  const abiertos = pedidos.filter((p) => p.estado === "abierto").length

  const mesasOrdenadas = [...mesas].sort((a, b) => Number(a.numero) - Number(b.numero))
  const empleadosConPedidos = Array.from(
    new Map(pedidos.filter((p) => p.empleadoId !== null).map((p) => [p.empleadoId!, p.empleadoNombre ?? `Empleado #${p.empleadoId}`])),
  )

  const pedidosFiltrados = pedidos
    .filter((p) => filtroMesa === TODOS || p.mesaId === filtroMesa)
    .filter((p) => filtroEmpleado === TODOS || p.empleadoId === filtroEmpleado)
    .filter((p) => filtroEstado === TODOS || p.estado === filtroEstado)
    .sort((a, b) => Number(b.id) - Number(a.id))

  function limpiarFiltros() {
    setFiltroMesa(TODOS)
    setFiltroEmpleado(TODOS)
    setFiltroEstado(TODOS)
  }

  function getMesaNumero(mesaId: string) {
    return mesas.find((m) => m.id === mesaId)?.numero ?? mesaId
  }

  function handleVerPedido(pedido: Pedido) {
    setPedidoSeleccionado(pedido)
    setDetalleAbierto(true)
  }

  const columnas: DataTableColumn<Pedido>[] = [
    { header: "Pedido", cell: (p) => <span className="font-mono">#{p.id}</span>, sortValue: (p) => Number(p.id) },
    { header: "Mesa", cell: (p) => `Mesa ${getMesaNumero(p.mesaId)}`, sortValue: (p) => getMesaNumero(p.mesaId) },
    { header: "Empleado", cell: (p) => p.empleadoNombre ?? "Sin información", sortValue: (p) => p.empleadoNombre ?? "" },
    { header: "Ítems", cell: (p) => cantidadItems(p), sortValue: cantidadItems },
    { header: "Total", cell: (p) => formatCurrency(p.total), sortValue: (p) => p.total },
    { header: "Estado", cell: (p) => <EstadoPedidoBadge estado={p.estado} />, sortValue: (p) => p.estado },
    {
      header: "Acciones",
      cell: (p) => (
        <Button variant="outline" size="sm" onClick={() => handleVerPedido(p)}>
          Ver detalle
        </Button>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Pedidos"
        subtitle={`${abiertos} abiertos`}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando pedidos…</p>}
        {error && <p role="alert">{error}</p>}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Select value={filtroMesa} onValueChange={setFiltroMesa}>
            <SelectTrigger aria-label="Filtrar por mesa" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas las mesas</SelectItem>
              {mesasOrdenadas.map((m) => <SelectItem key={m.id} value={m.id}>Mesa {m.numero}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroEmpleado} onValueChange={setFiltroEmpleado}>
            <SelectTrigger aria-label="Filtrar por empleado" className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos los empleados</SelectItem>
              {empleadosConPedidos.map(([id, nombre]) => <SelectItem key={id} value={id}>{nombre}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroEstado} onValueChange={(value) => setFiltroEstado(value as EstadoPedido | typeof TODOS)}>
            <SelectTrigger aria-label="Filtrar por estado" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos los estados</SelectItem>
              <SelectItem value="abierto">Abiertos</SelectItem>
              <SelectItem value="pagado">Pagados</SelectItem>
            </SelectContent>
          </Select>
          {hayFiltros && (
            <>
              <Button variant="ghost" size="sm" onClick={limpiarFiltros}>Limpiar filtros</Button>
              <span className="font-mono text-xs text-muted-foreground">{pedidosFiltrados.length} de {pedidos.length}</span>
            </>
          )}
        </div>
        <DataTable
          columns={columnas}
          data={pedidosFiltrados}
          getRowKey={(p) => p.id}
          emptyMessage={hayFiltros ? "No hay pedidos que coincidan con los filtros." : "Todavía no hay pedidos."}
        />
      </div>

      <PedidoDetailModal
        open={detalleAbierto}
        onOpenChange={(open) => {
          setDetalleAbierto(open)
          if (!open) setPedidoSeleccionado(null)
        }}
        pedido={pedidoSeleccionado}
        mesaNumero={pedidoSeleccionado ? getMesaNumero(pedidoSeleccionado.mesaId) : ""}
      />
    </div>
  )
}
