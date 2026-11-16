"use client"

import { Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { Progres } from "@/lib/evaluare/interviu/graf"
import { cn } from "@/lib/utils"

export function BaraProgres({ progres }: { progres: Progres }) {
  const curent = progres.blocuri[progres.indexBloc]
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium">{curent?.titlu}</span>
        <span className="shrink-0 text-muted-foreground">
          Partea {progres.indexBloc + 1} din {progres.totalBlocuri}
        </span>
      </div>
      <Progress value={progres.procent} className="h-2" aria-label="Progresul interviului" />
      <ol className="hidden flex-wrap gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground md:flex">
        {progres.blocuri.map((bloc) => (
          <li
            key={bloc.id}
            aria-current={bloc.stare === "curent" ? "step" : undefined}
            className={cn("flex items-center gap-1", bloc.stare === "curent" && "font-semibold text-foreground")}
          >
            {bloc.stare === "terminat" && <Check className="h-3 w-3 text-primary" aria-hidden="true" />}
            {bloc.titlu}
          </li>
        ))}
      </ol>
    </div>
  )
}
