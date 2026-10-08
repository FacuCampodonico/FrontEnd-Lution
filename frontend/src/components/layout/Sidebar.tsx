import { NavLink, useNavigate } from "react-router-dom"
import { Boxes, ClipboardList, LogOut, ShoppingBag, Tags, UtensilsCrossed, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import type { Nivel } from "@/types/auth"

const NAV_ITEMS: { to: string; label: string; icon: typeof UtensilsCrossed; niveles: readonly Nivel[] }[] = [
  { to: "/mesas", label: "Mesas", icon: UtensilsCrossed, niveles: ["admin", "mozo"] },
  { to: "/pedidos", label: "Pedidos", icon: ClipboardList, niveles: ["admin"] },
  { to: "/productos", label: "Productos", icon: ShoppingBag, niveles: ["admin"] },
  { to: "/insumos", label: "Insumos", icon: Boxes, niveles: ["admin"] },
  { to: "/categorias", label: "Categorías", icon: Tags, niveles: ["admin"] },
  { to: "/empleados", label: "Empleados", icon: Users, niveles: ["admin"] },
]

export function Sidebar() {
  const { empleado, logout } = useAuth()
  const navigate = useNavigate()

  const items = NAV_ITEMS.filter((item) => empleado !== null && item.niveles.includes(empleado.nivel))

  function cerrarSesion() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <aside className="flex w-52 shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground">
      <div className="flex items-center gap-2 px-2 py-3">
        <img src="/logo-lution.jpeg" alt="Lution" className="size-6 rounded-md object-cover" />
        <span className="text-base font-semibold">Lution</span>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      {empleado && (
        <div className="mt-auto flex flex-col gap-2 border-t border-sidebar-border pt-3">
          <div className="min-w-0 px-3">
            <p className="truncate text-sm font-medium">{empleado.nombre}</p>
            <p className="truncate text-xs text-sidebar-foreground/70">{empleado.rolNombre}</p>
          </div>
          <Button variant="ghost" size="sm" className="justify-start px-3" onClick={cerrarSesion}>
            <LogOut />
            Cerrar sesión
          </Button>
        </div>
      )}
    </aside>
  )
}
