"use client"

// Oprirea blândă: recomandare de consult medical, fără plan, fără cifre și fără programare.

import Link from "next/link"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { CONFIG_IMPLICIT } from "@/lib/evaluare/config"
import { OPRIRI, UI } from "@/lib/evaluare/interviu/texte"
import { useEvaluare } from "./stare"

const config = CONFIG_IMPLICIT

export function EcranOprire() {
  const { stare, actualizeaza, reseteaza } = useEvaluare()
  const titluRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    titluRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [])

  const tip = stare.oprire?.tip
  if (!tip) return null
  const mesaj = OPRIRI[tip]
  const minor = tip === "minor"

  return (
    <div className="space-y-6 rounded-lg border bg-white p-5 shadow-sm md:p-8">
      <h1 ref={titluRef} tabIndex={-1} className="text-2xl font-semibold outline-none md:text-3xl">
        {mesaj.titlu}
      </h1>
      {mesaj.paragrafe.map((paragraf) => (
        <p key={paragraf} className="text-lg text-gray-700">
          {paragraf}
        </p>
      ))}
      {tip === "tulburari_alimentare" && <p className="text-gray-700">{UI.urgenta}</p>}
      <p className="text-sm text-muted-foreground">
        {minor ? UI.oprireMinor : config.interviu.trimitereActiva ? UI.oprireCuTrimitere : UI.oprireFaraTrimitere}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {!minor && (
          <Button asChild>
            <Link href="/contact">{UI.contact}</Link>
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => (minor ? reseteaza() : actualizeaza({ etapa: "interviu", oprire: null }))}
        >
          Am ales din greșeală un răspuns
        </Button>
      </div>
    </div>
  )
}
