import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Frontend levantado</CardTitle>
          <CardDescription>
            React + Vite + TypeScript + Tailwind + shadcn/ui + react-router +
            axios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Todo listo</Button>
        </CardContent>
      </Card>
    </div>
  )
}
