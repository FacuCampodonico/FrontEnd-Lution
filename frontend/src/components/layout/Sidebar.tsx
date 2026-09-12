import { NavLink } from "react-router-dom"
import { Boxes, ShoppingBag, Tags, UtensilsCrossed, Users } from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/mesas", label: "Mesas", icon: UtensilsCrossed },
  { to: "/insumos", label: "Insumos", icon: Boxes },
  { to: "/categorias", label: "Categorías", icon: Tags },
  { to: "/productos", label: "Productos", icon: ShoppingBag },
  { to: "/empleados", label: "Empleados", icon: Users },
] as const

export function Sidebar() {
  return (
    <aside className="flex w-52 shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground">
      <div className="flex items-center gap-2 px-2 py-3">
        <img src="/logo-lution.jpeg" alt="Lution" className="size-6 rounded-md object-cover" />
        <span className="text-base font-semibold">Lution</span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
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
    </aside>
  )
}
