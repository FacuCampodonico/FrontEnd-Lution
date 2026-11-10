import { Badge } from "@/components/ui/badge"

interface ChipListProps {
  items: string[]
  onRemove?: (item: string) => void
}

export function ChipList({ items, onRemove }: ChipListProps) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="default" className="gap-1.5 py-1">
          {item}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="ml-0.5 leading-none"
              aria-label={`Quitar ${item}`}
            >
              ×
            </button>
          )}
        </Badge>
      ))}
    </div>
  )
}
