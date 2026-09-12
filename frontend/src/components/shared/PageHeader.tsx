import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-7">
      <div className="flex items-baseline gap-3">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <span className="font-mono text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        {children}
        {actionLabel && (
          <Button onClick={onAction}>+ {actionLabel}</Button>
        )}
      </div>
    </div>
  )
}
