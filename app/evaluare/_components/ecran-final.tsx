"use client"

// Ecranul final: rezumat scurt (fără cifre și fără plan) și pasul de programare.
// În Faza 1 butonul nu trimite nimic; afișează doar că programarea va fi activată în curând.

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { CalendarClock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CONFIG_IMPLICIT } from "@/lib/evaluare/config"
import { pasiVizibili } from "@/lib/evaluare/interviu/graf"
import { construiesteRezumat, verificaRezumat } from "@/lib/evaluare/interviu/rezumat"
import { CANALE_PROGRAMARE, INTERVALE_PROGRAMARE, UI } from "@/lib/evaluare/interviu/texte"
import { useEvaluare } from "./stare"

const config = CONFIG_IMPLICIT
const MAX_INTERVALE = 3
const CARD =
  "flex cursor-pointer items-center gap-3 rounded-md border bg-white p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"

export function EcranFinal() {
  const { stare, actualizeaza } = useEvaluare()
  const [intervale, setIntervale] = useState<string[]>([])
  const [canal, setCanal] = useState("")
  const [cerut, setCerut] = useState(false)
  const titluRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titluRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [])

  // Rezumatul trece prin aceeași verificare care va păzi textele scrise de AI în Faza 3.
  const rezumat = useMemo(() => {
    const observatii = construiesteRezumat(stare.raspunsuri, config)
    return verificaRezumat(observatii).length === 0 ? observatii : []
  }, [stare.raspunsuri])

  const complet = intervale.length >= 2 && canal !== ""
  const ultimulPas = pasiVizibili(stare.raspunsuri, config).at(-1)

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-lg border bg-white p-5 shadow-sm md:p-8">
        <h1 ref={titluRef} tabIndex={-1} className="text-2xl font-semibold outline-none md:text-3xl">
          {UI.finalTitlu}
        </h1>
        <p className="text-lg text-gray-700">{UI.finalIntro}</p>
        <ul className="list-disc space-y-3 pl-5 text-gray-700">
          {rezumat.map((observatie) => (
            <li key={observatie}>{observatie}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-5 rounded-lg border bg-white p-5 shadow-sm md:p-8">
        <h2 className="text-xl font-semibold md:text-2xl">{UI.programareTitlu}</h2>
        <p className="text-gray-700">{UI.programareIntro}</p>

        <div role="group" aria-labelledby="intervale-eticheta" className="space-y-2">
          <p id="intervale-eticheta" className="font-medium">
            {UI.programareIntervale}
          </p>
          {INTERVALE_PROGRAMARE.map((opt) => {
            const ales = intervale.includes(opt.valoare)
            return (
              <label key={opt.valoare} htmlFor={`interval-${opt.valoare}`} className={CARD}>
                <Checkbox
                  id={`interval-${opt.valoare}`}
                  checked={ales}
                  disabled={!ales && intervale.length >= MAX_INTERVALE}
                  className="h-5 w-5"
                  onCheckedChange={(bifat) => {
                    setCerut(false)
                    setIntervale(bifat === true ? [...intervale, opt.valoare] : intervale.filter((x) => x !== opt.valoare))
                  }}
                />
                <span>{opt.eticheta}</span>
              </label>
            )
          })}
        </div>

        <div className="space-y-2">
          <p id="canal-eticheta" className="font-medium">
            {UI.programareCanal}
          </p>
          <RadioGroup
            value={canal}
            onValueChange={(v) => {
              setCerut(false)
              setCanal(v)
            }}
            aria-labelledby="canal-eticheta"
            className="gap-2 sm:grid-cols-3"
          >
            {CANALE_PROGRAMARE.map((opt) => (
              <label key={opt.valoare} htmlFor={`canal-${opt.valoare}`} className={CARD}>
                <RadioGroupItem value={opt.valoare} id={`canal-${opt.valoare}`} className="h-5 w-5 shrink-0" />
                <span>{opt.eticheta}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        <Button size="lg" disabled={!complet} onClick={() => setCerut(true)}>
          <CalendarClock aria-hidden="true" />
          {UI.programareButon}
        </Button>

        <div aria-live="polite">
          {cerut && (
            <Alert>
              <AlertDescription className="space-y-2 text-base">
                <p>{UI.programareInCurand}</p>
                <Link href="/contact" className="font-medium text-primary underline underline-offset-4">
                  {UI.contact}
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Button variant="ghost" onClick={() => actualizeaza({ etapa: "interviu", idPas: ultimulPas?.id ?? null })}>
        {UI.inapoi}
      </Button>
    </div>
  )
}
