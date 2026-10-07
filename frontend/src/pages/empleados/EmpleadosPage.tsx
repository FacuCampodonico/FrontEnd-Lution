import { useState } from "react"

import { CrearEmpleadoModal } from "@/components/modales/CrearEmpleadoModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { useEmpleados } from "@/hooks/useEmpleados"
import type { Empleado } from "@/types/empleado"

const columnas: DataTableColumn<Empleado>[] = [
  { header: "Nombre", cell: (e) => e.nombre },
  { header: "DNI", cell: (e) => e.dni },
  { header: "Rol", cell: (e) => (e.rolNombre ?? "Sin información") },
  { header: "Estado", cell: (e) => (e.activo === null ? "Sin información" : e.activo ? "Activo" : "Inactivo") },
]

export default function EmpleadosPage() {
  const { empleados, rolesDisponibles, loading, error, crearEmpleado } = useEmpleados()
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Empleados"
        actionLabel="Crear empleado"
        onAction={() => setModalAbierto(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando empleados…</p>}
        {error && <p role="alert">{error}</p>}
        <DataTable
          columns={columnas}
          data={empleados}
          getRowKey={(e) => e.id}
          emptyMessage="Todavía no cargaste empleados."
        />
      </div>

      <CrearEmpleadoModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        rolesDisponibles={rolesDisponibles}
        onSubmit={crearEmpleado}
      />
    </div>
  )
}
