import type { ComponentType } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MetodoPago } from "@/types/pago"

interface MetodoPagoCardProps {
  metodo: MetodoPago
  label: string
  icon: ComponentType<{ className?: string }>
  disabled?: boolean
  onSelect: (metodo: MetodoPago) => void
}

export function MetodoPagoCard({
  metodo,
  label,
  icon: Icon,
  disabled,
  onSelect,
}: MetodoPagoCardProps) {
  return (
    <Card
      role="button"
      aria-disabled={disabled}
      onClick={() => !disabled && onSelect(metodo)}
      className={cn(
        "cursor-pointer items-center py-6 text-center transition-colors hover:bg-muted/50",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <CardContent className="flex flex-col items-center gap-2">
        <Icon className="size-8 text-muted-foreground" />
        <span className="text-sm font-semibold">{label}</span>
      </CardContent>
    </Card>
  )
}
