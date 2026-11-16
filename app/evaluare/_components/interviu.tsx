"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CONFIG_IMPLICIT } from "@/lib/evaluare/config"
import {
  campuriVizibile,
  eroriPas,
  oprireDinRaspunsuri,
  pasiVizibili,
  progres,
} from "@/lib/evaluare/interviu/graf"
import type { Valoare } from "@/lib/evaluare/interviu/raspunsuri"
import { BLOCURI, INTRO_PASI, UI } from "@/lib/evaluare/interviu/texte"
import { BaraProgres } from "./bara-progres"
import { CampIntrebare } from "./camp"
import { useEvaluare } from "./stare"

const config = CONFIG_IMPLICIT

export function Interviu() {
  const { stare, actualizeaza } = useEvaluare()
  const { raspunsuri } = stare
  const [erori, setErori] = useState<Record<string, string>>({})
  const titluRef = useRef<HTMLHeadingElement>(null)

  const pasi = pasiVizibili(raspunsuri, config)
  const index = Math.max(
    0,
    pasi.findIndex((p) => p.id === stare.idPas),
  )
  const pas = pasi[index]
  const campuri = campuriVizibile(pas, raspunsuri, config)
  const estePrimulPasDinBloc = index === 0 || pasi[index - 1].bloc !== pas.bloc
  const intro = INTRO_PASI[pas.id]

  // La fiecare pas nou, mutăm focusul pe titlu, ca cititoarele de ecran să-l anunțe.
  useEffect(() => {
    titluRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [pas.id])

  const schimba = (id: string, valoare: Valoare) => {
    actualizeaza({ raspunsuri: { ...raspunsuri, [id]: valoare } })
    if (erori[id]) setErori(({ [id]: _stearsa, ...rest }) => rest)
  }

  const continua = () => {
    const eroriNoi = eroriPas(pas, raspunsuri, config, new Date())
    setErori(eroriNoi)
    if (Object.keys(eroriNoi).length > 0) return

    // Opririle de siguranță se verifică după fiecare pas, înaintea oricărei alte întrebări.
    const oprire = oprireDinRaspunsuri(raspunsuri, config, new Date())
    if (oprire) {
      // Sub 18 ani nu păstrăm niciun răspuns.
      actualizeaza({ etapa: "oprit", oprire, raspunsuri: oprire.tip === "minor" ? {} : raspunsuri })
      return
    }
    const urmator = pasi[index + 1]
    actualizeaza(urmator ? { idPas: urmator.id } : { etapa: "final" })
  }

  const inapoi = () => {
    setErori({})
    actualizeaza(index > 0 ? { idPas: pasi[index - 1].id } : { etapa: "consimtamant" })
  }

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        continua()
      }}
    >
      <BaraProgres progres={progres(pas.id, raspunsuri, config)} />

      <div className="space-y-6 rounded-lg border bg-white p-5 shadow-sm md:p-8">
        <h1 ref={titluRef} tabIndex={-1} className="text-xl font-semibold text-primary outline-none md:text-2xl">
          {BLOCURI[pas.bloc]}
        </h1>
        {estePrimulPasDinBloc && intro && <p className="text-gray-700">{intro}</p>}

        {campuri.map((camp) => (
          <CampIntrebare
            key={camp.id}
            camp={camp}
            valoare={raspunsuri[camp.id]}
            eroare={erori[camp.id]}
            onSchimba={(valoare) => schimba(camp.id, valoare)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button type="button" variant="ghost" onClick={inapoi}>
          <ArrowLeft aria-hidden="true" />
          {UI.inapoi}
        </Button>
        <Button type="submit" size="lg">
          {index === pasi.length - 1 ? UI.finalizeaza : UI.continua}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}
