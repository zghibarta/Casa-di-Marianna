"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CONFIG_IMPLICIT } from "@/lib/evaluare/config"
import { UI } from "@/lib/evaluare/interviu/texte"
import { useEvaluare } from "./stare"

const config = CONFIG_IMPLICIT

export function Consimtamant() {
  const { stare, actualizeaza } = useEvaluare()
  const [sanatate, setSanatate] = useState(stare.consimtamant?.sanatate ?? false)
  const [ai, setAi] = useState(stare.consimtamant?.ai ?? false)
  const [varsta, setVarsta] = useState(stare.consimtamant?.varsta ?? false)

  const cereAI = config.interviu.consimtamantAI
  const complet = sanatate && varsta && (!cereAI || ai)

  const incepe = () => {
    if (!complet) return
    actualizeaza({
      etapa: "interviu",
      consimtamant: {
        versiune: config.interviu.versiuneConsimtamant,
        data: new Date().toISOString(),
        sanatate,
        varsta,
        ai: cereAI ? ai : false,
      },
    })
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold md:text-4xl">{UI.titlu}</h1>
        <p className="text-lg text-gray-700">{UI.bunVenit}</p>
      </header>

      <Alert>
        <Info className="h-4 w-4" aria-hidden="true" />
        <AlertDescription>{UI.faza1}</AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Bifa id="acord-sanatate" bifat={sanatate} onSchimba={setSanatate} text={UI.consimtamantSanatate} />
        {cereAI && <Bifa id="acord-ai" bifat={ai} onSchimba={setAi} text={UI.consimtamantAI} />}
        <Bifa id="acord-varsta" bifat={varsta} onSchimba={setVarsta} text={UI.consimtamantVarsta} />
      </div>

      <p className="text-sm text-muted-foreground">{UI.notaInformare}</p>

      <Button size="lg" onClick={incepe} disabled={!complet} className="w-full sm:w-auto">
        {UI.incepe}
      </Button>
    </div>
  )
}

function Bifa(props: { id: string; bifat: boolean; onSchimba: (v: boolean) => void; text: string }) {
  return (
    <label
      htmlFor={props.id}
      className="flex cursor-pointer items-start gap-3 rounded-md border bg-white p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
    >
      <Checkbox
        id={props.id}
        checked={props.bifat}
        onCheckedChange={(v) => props.onSchimba(v === true)}
        className="mt-0.5 h-5 w-5"
      />
      <span className="leading-relaxed">{props.text}</span>
    </label>
  )
}
