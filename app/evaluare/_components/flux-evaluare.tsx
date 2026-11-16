"use client"

import Link from "next/link"
import { useEffect } from "react"
import { UI } from "@/lib/evaluare/interviu/texte"
import { Consimtamant } from "./consimtamant"
import { EcranFinal } from "./ecran-final"
import { EcranOprire } from "./ecran-oprire"
import { Interviu } from "./interviu"
import { useEvaluare } from "./stare"

export function FluxEvaluare({ adresaEmail }: { adresaEmail?: string }) {
  const { stare } = useEvaluare()
  const areRaspunsuri = Object.keys(stare.raspunsuri).length > 0
  const inCurs = stare.etapa === "interviu" && areRaspunsuri

  // Până la „Trimite”, răspunsurile există doar în memorie: avertizăm înainte ca pagina să fie închisă.
  useEffect(() => {
    if (!inCurs) return
    const avertizeaza = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = UI.parasire
    }
    window.addEventListener("beforeunload", avertizeaza)
    return () => window.removeEventListener("beforeunload", avertizeaza)
  }, [inCurs])

  return (
    <div className="mx-auto max-w-2xl">
      {stare.etapa === "consimtamant" && <Consimtamant adresaEmail={adresaEmail} />}
      {stare.etapa === "interviu" && <Interviu />}
      {stare.etapa === "oprit" && <EcranOprire />}
      {stare.etapa === "final" && <EcranFinal />}

      {process.env.NODE_ENV !== "production" && (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Mediu de dezvoltare:{" "}
          <Link href="/evaluare/debug" className="underline">
            fișa de verificare
          </Link>
        </p>
      )}
    </div>
  )
}
