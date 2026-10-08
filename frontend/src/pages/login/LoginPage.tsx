import { useState, type FormEvent } from "react"
import { Navigate, useLocation, type Location } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { useAuth } from "@/hooks/useAuth"

function destinoTrasLogin(state: unknown): string {
  const from = (state as { from?: Location } | null)?.from
  if (!from?.pathname || from.pathname === "/login") return "/mesas"
  return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
}

export default function LoginPage() {
  const { empleado, cargando, login } = useAuth()
  const location = useLocation()
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const { pending, error, run } = useAsyncAction()

  if (empleado) return <Navigate to={destinoTrasLogin(location.state)} replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await run(() => login(dni.trim(), password))
  }

  const deshabilitado = pending || cargando

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <img src="/logo-lution.jpeg" alt="" className="size-7 rounded-md object-cover" />
            <span className="text-base font-semibold">Lution</span>
          </div>
          <CardTitle className="text-lg font-semibold tracking-tight">Iniciar sesión</CardTitle>
          <CardDescription>Ingresá con tu DNI y contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <Label htmlFor="login-dni">DNI</Label>
            <Input
              id="login-dni"
              name="dni"
              inputMode="numeric"
              autoComplete="username"
              maxLength={20}
              autoFocus
              required
              disabled={deshabilitado}
              value={dni}
              onChange={(event) => setDni(event.target.value)}
            />
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={deshabilitado}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="mt-1" disabled={deshabilitado || !dni.trim() || !password}>
              {pending ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
