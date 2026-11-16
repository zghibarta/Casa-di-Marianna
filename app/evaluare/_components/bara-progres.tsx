"use client"

import { Progress } from "@/components/ui/progress"
import { UI } from "@/lib/evaluare/interviu/texte"

interface Props {
  /** Numărul ecranului curent; consimțământul este pasul 1. */
  pas: number
  total: number
  /** 0–100. */
  procent: number
  titlu?: string
}

export function BaraProgres({ pas, total, procent, titlu }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium">{titlu}</span>
        <span className="shrink-0 text-muted-foreground">{UI.pas(pas, total)}</span>
      </div>
      <Progress value={procent} className="h-2" aria-label={UI.pas(pas, total)} />
    </div>
  )
}
