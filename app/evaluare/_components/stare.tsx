"use client"

// Starea evaluării trăiește doar în memoria browserului (React state). Nu se scrie în
// localStorage, în URL sau pe server: la reîncărcarea paginii se pierde, intenționat (Faza 1).

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { Raspunsuri } from "@/lib/evaluare/interviu/raspunsuri"
import type { Oprire } from "@/lib/evaluare/tipuri"

export interface Consimtamant {
  versiune: string
  data: string
  sanatate: boolean
  varsta: boolean
  ai: boolean
}

export interface StareEvaluare {
  etapa: "consimtamant" | "interviu" | "oprit" | "final"
  consimtamant: Consimtamant | null
  raspunsuri: Raspunsuri
  /** Id-ul pasului curent din graf; null = primul pas vizibil. */
  idPas: string | null
  oprire: Oprire | null
}

const STARE_INITIALA: StareEvaluare = {
  etapa: "consimtamant",
  consimtamant: null,
  raspunsuri: {},
  idPas: null,
  oprire: null,
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
