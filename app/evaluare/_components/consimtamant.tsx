"use client"

// Ecranul 1: acordul, înaintea oricărei întrebări. Bifa este nebifată implicit și obligatorie.
// Textele sunt în lib/evaluare/interviu/texte.ts.

import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CONFIG_IMPLICIT } from "@/lib/evaluare/config"
import { totalEcrane } from "@/lib/evaluare/interviu/graf"
import { UI, textInformare } from "@/lib/evaluare/interviu/texte"
import { BaraProgres } from "./bara-progres"
import { useEvaluare } from "./stare"

const config = CONFIG_IMPLICIT

/** @param adresaEmail adresa la care pleacă fișa (din variabilele de mediu), afișată în informare. */
export function Consimtamant({ adresaEmail }: { adresaEmail?: string }) {
  const { stare, actualizeaza } = useEvaluare()
  const [sanatate, setSanatate] = useState(stare.consimtamant?.sanatate ?? false)
  const [ai, setAi] = useState(stare.consimtamant?.ai ?? false)

  const cereAI = config.interviu.consimtamantAI
  const complet = sanatate && (!cereAI || ai)

  const incepe = () => {
    if (!complet) return
    actualizeaza({
      etapa: "interviu",
      consimtamant: {
        versiune: config.interviu.versiuneConsimtamant,
        data: new Date().toISOString(),
        sanatate,
        ai: cereAI ? ai : false,
      },
    })
  }

  return (
    <div className="space-y-6">
      <BaraProgres pas={1} total={totalEcrane(stare.raspunsuri, config)} procent={0} />

      <header className="space-y-4">
        <h1 className="text-3xl font-bold md:text-4xl">{UI.titlu}</h1>
        <p className="text-lg text-gray-700">{UI.bunVenit}</p>
        <p className="flex items-center gap-2 font-medium text-primary">
          <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
          {UI.durata}
        </p>
      </header>

      <div className="space-y-3">
        <Bifa
          id="acord-sanatate"
          bifat={sanatate}
          onSchimba={setSanatate}
          text={UI.consimtamantSanatate}
          descrisDe="informare-date"
        />
        {cereAI && <Bifa id="acord-ai" bifat={ai} onSchimba={setAi} text={UI.consimtamantAI} />}
        <p id="informare-date" className="text-sm leading-relaxed text-muted-foreground">
          {config.interviu.trimitereActiva ? textInformare(adresaEmail) : UI.informareFaraTrimitere}
        </p>
      </div>

      <Button size="lg" onClick={incepe} disabled={!complet} className="w-full sm:w-auto">
        {UI.incepe}
      </Button>
    </div>
  )
}

function Bifa(props: { id: string; bifat: boolean; onSchimba: (v: boolean) => void; text: string; descrisDe?: string }) {
  return (
    <label
      htmlFor={props.id}
      className="flex cursor-pointer items-start gap-3 rounded-md border bg-white p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
    >
      <Checkbox
        id={props.id}
        checked={props.bifat}
        onCheckedChange={(v) => props.onSchimba(v === true)}
        aria-describedby={props.descrisDe}
        className="mt-0.5 h-5 w-5"
      />
      <span className="leading-relaxed">{props.text}</span>
    </label>
  )
}
