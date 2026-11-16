"use client"

// Starea evaluării trăiește doar în memoria browserului (React state). Nu se scrie în
// localStorage sau în URL: la reîncărcarea paginii se pierde, intenționat. Răspunsurile pleacă
// spre server o singură dată, la „Trimite”, și se șterg din memorie după ce au fost trimise.

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { Raspunsuri } from "@/lib/evaluare/interviu/raspunsuri"
import type { Oprire } from "@/lib/evaluare/tipuri"

export interface Consimtamant {
  versiune: string
  data: string
  sanatate: boolean
  ai: boolean
}

export interface StareEvaluare {
  etapa: "consimtamant" | "interviu" | "oprit" | "final"
  consimtamant: Consimtamant | null
  raspunsuri: Raspunsuri
  /** Id-ul pasului curent din graf; null = primul pas vizibil. */
  idPas: string | null
  oprire: Oprire | null
  /** Observațiile de pe ecranul final, calculate înainte ca răspunsurile să fie șterse. */
  rezumat: string[]
  /** true după ce serverul a confirmat trimiterea fișei. */
  trimis: boolean
}

const STARE_INITIALA: StareEvaluare = {
  etapa: "consimtamant",
  consimtamant: null,
  raspunsuri: {},
  idPas: null,
  oprire: null,
  rezumat: [],
  trimis: false,
}

interface ContextEvaluare {
  stare: StareEvaluare
  actualizeaza: (schimbari: Partial<StareEvaluare>) => void
  reseteaza: () => void
}

const Context = createContext<ContextEvaluare | null>(null)

export function EvaluareProvider({ children }: { children: ReactNode }) {
  const [stare, setStare] = useState<StareEvaluare>(STARE_INITIALA)
  const valoare = useMemo<ContextEvaluare>(
    () => ({
      stare,
      actualizeaza: (schimbari) => setStare((veche) => ({ ...veche, ...schimbari })),
      reseteaza: () => setStare(STARE_INITIALA),
    }),
    [stare],
  )
  return <Context.Provider value={valoare}>{children}</Context.Provider>
}

export function useEvaluare(): ContextEvaluare {
  const context = useContext(Context)
  if (!context) throw new Error("useEvaluare trebuie folosit în interiorul EvaluareProvider")
  return context
}
