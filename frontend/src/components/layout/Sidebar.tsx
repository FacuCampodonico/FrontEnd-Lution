import { Link, NavLink, useNavigate } from "react-router-dom"
import { Boxes, ClipboardList, LogOut, ShoppingBag, Tags, UtensilsCrossed, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import type { AccessLevel } from "@/types/auth"

const NAV_ITEMS: { to: string; label: string; icon: typeof UtensilsCrossed; levels: readonly AccessLevel[] }[] = [
  { to: "/mesas", label: "Mesas", icon: UtensilsCrossed, levels: ["admin", "mozo"] },
  { to: "/pedidos", label: "Pedidos", icon: ClipboardList, levels: ["admin"] },
  { to: "/productos", label: "Productos", icon: ShoppingBag, levels: ["admin"] },
  { to: "/insumos", label: "Insumos", icon: Boxes, levels: ["admin"] },
  { to: "/categorias", label: "Categorías", icon: Tags, levels: ["admin"] },
  { to: "/empleados", label: "Empleados", icon: Users, levels: ["admin"] },
]

export function Sidebar() {
  const { employee, logout } = useAuth()
  const navigate = useNavigate()

  const items = NAV_ITEMS.filter((item) => employee !== null && item.levels.includes(employee.nivel))

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <aside className="flex w-52 shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground">
      <Link to="/mesas" aria-label="Lution, ir a mesas" className="flex items-center gap-2 rounded-lg px-2 py-3 transition-opacity hover:opacity-80">
        <img src="/logo-lution.jpeg" alt="" className="size-6 rounded-md object-cover" />
        <span className="text-base font-semibold">Lution</span>
      </Link>
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
      {employee && (
        <div className="mt-auto flex flex-col gap-2 border-t border-sidebar-border pt-3">
          <div className="min-w-0 px-3">
            <p className="truncate text-sm font-medium">{employee.nombre}</p>
            <p className="truncate text-xs text-sidebar-foreground/70">{employee.rolNombre}</p>
          </div>
          <Button variant="ghost" size="sm" className="justify-start px-3" onClick={handleLogout}>
            <LogOut />
            Cerrar sesión
          </Button>
        </div>
      )}
    </aside>
  )
}
