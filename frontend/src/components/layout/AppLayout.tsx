import { Outlet } from "react-router-dom"

import { Sidebar } from "@/components/layout/Sidebar"

export function AppLayout() {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-muted/30">
        <Outlet />
      </main>
    </div>
  )
}
