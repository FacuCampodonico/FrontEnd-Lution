import { useState } from "react"

import { PedidoDetailModal } from "@/components/modales/PedidoDetailModal"
import { EstadoPedidoBadge } from "@/components/pedidos/EstadoPedidoBadge"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmpleados } from "@/hooks/useEmpleados"
import { useMesas } from "@/hooks/useMesas"
import { usePedidos, usePedidosAbiertos } from "@/hooks/usePedidos"
import { formatCurrency } from "@/lib/utils"
import type { EstadoPedido, Pedido } from "@/types/pedido"

const TODOS = "todos"
const POR_PAGINA = 10

function cantidadItems(pedido: Pedido) {
  return pedido.items.reduce((total, item) => total + item.cantidad, 0)
}

export default function PedidosPage() {
  const { mesas } = useMesas()
  const { empleados } = useEmpleados()
  const abiertos = usePedidosAbiertos()

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)
  const [detalleAbierto, setDetalleAbierto] = useState(false)

  const [filtroMesa, setFiltroMesa] = useState(TODOS)
  const [filtroEmpleado, setFiltroEmpleado] = useState(TODOS)
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | typeof TODOS>(TODOS)
  const [pagina, setPagina] = useState(1)
  const hayFiltros = filtroMesa !== TODOS || filtroEmpleado !== TODOS || filtroEstado !== TODOS

  const { pedidos, total, loading, error } = usePedidos({
    mesaId: filtroMesa === TODOS ? undefined : filtroMesa,
    empleadoId: filtroEmpleado === TODOS ? undefined : filtroEmpleado,
    estado: filtroEstado === TODOS ? undefined : filtroEstado,
    pagina,
    limite: POR_PAGINA,
  })
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA))

  const mesasOrdenadas = [...mesas].sort((a, b) => Number(a.numero) - Number(b.numero))
  const empleadosOrdenados = [...empleados].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))

  // Cambiar un filtro vuelve a la primera página.
  function filtrarPor<T>(setFiltro: (valor: T) => void) {
    return (valor: T) => {
      setFiltro(valor)
      setPagina(1)
    }
  }

  function limpiarFiltros() {
    setFiltroMesa(TODOS)
    setFiltroEmpleado(TODOS)
    setFiltroEstado(TODOS)
    setPagina(1)
  }

  function getMesaNumero(mesaId: string) {
    return mesas.find((m) => m.id === mesaId)?.numero ?? mesaId
  }

  function handleVerPedido(pedido: Pedido) {
    setPedidoSeleccionado(pedido)
    setDetalleAbierto(true)
  }

  const columnas: DataTableColumn<Pedido>[] = [
    { header: "Pedido", cell: (p) => <span className="font-mono">#{p.id}</span> },
    { header: "Mesa", cell: (p) => `Mesa ${getMesaNumero(p.mesaId)}` },
    { header: "Empleado", cell: (p) => p.empleadoNombre ?? "Sin información" },
    { header: "Ítems", cell: (p) => cantidadItems(p) },
    { header: "Total", cell: (p) => formatCurrency(p.total) },
    { header: "Estado", cell: (p) => <EstadoPedidoBadge estado={p.estado} /> },
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
        subtitle={abiertos === null ? undefined : `${abiertos} abiertos`}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando pedidos…</p>}
        {error && <p role="alert">{error}</p>}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Select value={filtroMesa} onValueChange={filtrarPor(setFiltroMesa)}>
            <SelectTrigger aria-label="Filtrar por mesa" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas las mesas</SelectItem>
              {mesasOrdenadas.map((m) => <SelectItem key={m.id} value={m.id}>Mesa {m.numero}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroEmpleado} onValueChange={filtrarPor(setFiltroEmpleado)}>
            <SelectTrigger aria-label="Filtrar por empleado" className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos los empleados</SelectItem>
              {empleadosOrdenados.map((e) => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroEstado} onValueChange={(value) => filtrarPor(setFiltroEstado)(value as EstadoPedido | typeof TODOS)}>
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
            <Button variant="ghost" size="sm" onClick={limpiarFiltros}>Limpiar filtros</Button>
          )}
          <span className="font-mono text-xs text-muted-foreground">{total} pedidos</span>
        </div>
        <DataTable
          columns={columnas}
          data={pedidos}
          getRowKey={(p) => p.id}
          emptyMessage={hayFiltros ? "No hay pedidos que coincidan con los filtros." : "Todavía no hay pedidos."}
        />
        {totalPaginas > 1 && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" disabled={pagina <= 1 || loading} onClick={() => setPagina((p) => p - 1)}>
              Anterior
            </Button>
            <span className="font-mono text-xs text-muted-foreground">Página {pagina} de {totalPaginas}</span>
            <Button variant="outline" size="sm" disabled={pagina >= totalPaginas || loading} onClick={() => setPagina((p) => p + 1)}>
              Siguiente
            </Button>
          </div>
        )}
      </div>

      <PedidoDetailModal
        open={detalleAbierto}
        onOpenChange={(open) => {
          setDetalleAbierto(open)
          if (!open) setPedidoSeleccionado(null)
        }}
        pedidoId={pedidoSeleccionado?.id ?? null}
        mesaNumero={pedidoSeleccionado ? getMesaNumero(pedidoSeleccionado.mesaId) : ""}
      />
    </div>
  )
}
