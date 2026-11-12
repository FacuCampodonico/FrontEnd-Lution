import { useState } from "react"

import { CrearEmpleadoModal } from "@/components/modales/CrearEmpleadoModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { useEmpleados } from "@/hooks/useEmpleados"
import { useRoles } from "@/hooks/useRoles"
import type { Employee } from "@/types/empleado"

const columns: DataTableColumn<Employee>[] = [
  { header: "Nombre", cell: (e) => e.nombre },
  { header: "DNI", cell: (e) => e.dni },
  { header: "Rol", cell: (e) => (e.rolNombre ?? "Sin información") },
  { header: "Estado", cell: (e) => (e.activo === null ? "Sin información" : e.activo ? "Activo" : "Inactivo") },
]

export default function EmpleadosPage() {
  const { employees, loading, error, createEmployee } = useEmpleados()
  const roles = useRoles()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Empleados"
        actionLabel="Crear empleado"
        onAction={() => setCreateOpen(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando empleados…</p>}
        {error && <p role="alert">{error}</p>}
        <DataTable
          columns={columns}
          data={employees}
          getRowKey={(e) => e.id}
          emptyMessage="Todavía no cargaste empleados."
        />
      </div>

      <CrearEmpleadoModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        availableRoles={roles.roles}
        loadingRoles={roles.loading}
        rolesError={roles.error}
        onReloadRoles={roles.refetch}
        onSubmit={createEmployee}
      />
    </div>
  )
}
