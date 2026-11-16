"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CONFIG_IMPLICIT } from "@/lib/evaluare/config"
import {
  campuriVizibile,
  eroriPas,
  oprireDinRaspunsuri,
  pasiVizibili,
  progres,
  raspunsuriActive,
} from "@/lib/evaluare/interviu/graf"
import type { Valoare } from "@/lib/evaluare/interviu/raspunsuri"
import { construiesteRezumat, verificaRezumat } from "@/lib/evaluare/interviu/rezumat"
import { BLOCURI, INTRO_PASI, UI, textCamp } from "@/lib/evaluare/interviu/texte"
import { BaraProgres } from "./bara-progres"
import { CampIntrebare } from "./camp"
import { Capcana } from "./capcana"
import { useEvaluare } from "./stare"
import { mesajEroare, trimiteLaServer } from "./trimite"

const config = CONFIG_IMPLICIT

export function Interviu() {
  const { stare, actualizeaza } = useEvaluare()
  const { raspunsuri } = stare
  const [erori, setErori] = useState<Record<string, string>>({})
  const [capcana, setCapcana] = useState("")
  const [seTrimite, setSeTrimite] = useState(false)
  const [eroareTrimitere, setEroareTrimitere] = useState<string | null>(null)
  const titluRef = useRef<HTMLHeadingElement>(null)

  const pasi = pasiVizibili(raspunsuri, config)
  const index = Math.max(
    0,
    pasi.findIndex((p) => p.id === stare.idPas),
  )
  const pas = pasi[index]
  const campuri = campuriVizibile(pas, raspunsuri, config)
  const estePrimulPasDinBloc = index === 0 || pasi[index - 1].bloc !== pas.bloc
  const esteUltimulPas = index === pasi.length - 1
  const intro = INTRO_PASI[pas.id]
  const stareProgres = progres(pas.id, raspunsuri, config)

  // La fiecare pas nou, mutăm focusul pe titlu, ca cititoarele de ecran să-l anunțe.
  useEffect(() => {
    titluRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [pas.id])

  const schimba = (id: string, valoare: Valoare) => {
    actualizeaza({ raspunsuri: { ...raspunsuri, [id]: valoare } })
    if (erori[id]) setErori(({ [id]: _stearsa, ...rest }) => rest)
    setEroareTrimitere(null)
  }

  // Rezumatul trece prin aceeași verificare care va păzi textele scrise de AI în Faza 3.
  const rezumat = () => {
    const observatii = construiesteRezumat(raspunsuri, config)
    return verificaRezumat(observatii).length === 0 ? observatii : []
  }

  const trimite = async () => {
    if (!config.interviu.trimitereActiva) {
      actualizeaza({ etapa: "final", rezumat: rezumat(), trimis: false })
      return
    }
    setSeTrimite(true)
    setEroareTrimitere(null)
    const rezultat = await trimiteLaServer({
      tip: "evaluare",
      consimtamant: stare.consimtamant?.sanatate === true,
      // Pleacă doar răspunsurile la întrebările vizibile acum.
      raspunsuri: raspunsuriActive(raspunsuri, config),
      website: capcana,
    })
    setSeTrimite(false)
    if (rezultat.ok) {
      // După trimitere, răspunsurile nu mai rămân în memoria browserului.
      actualizeaza({ etapa: "final", rezumat: rezumat(), trimis: true, raspunsuri: {}, idPas: null })
      return
    }
    if (rezultat.cod === "oprire" && rezultat.oprire) {
      actualizeaza({ etapa: "oprit", oprire: { tip: rezultat.oprire, detaliu: "" } })
      return
    }
    // Starea formularului rămâne neatinsă: nimic nu se pierde.
    setEroareTrimitere(mesajEroare(rezultat.cod))
  }

  const continua = () => {
    if (seTrimite) return
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
    if (esteUltimulPas) void trimite()
    else actualizeaza({ idPas: pasi[index + 1].id })
  }

  const inapoi = () => {
    setErori({})
    setEroareTrimitere(null)
    actualizeaza(index > 0 ? { idPas: pasi[index - 1].id } : { etapa: "consimtamant" })
  }

  return (
    <form
      noValidate
      className="relative space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        continua()
      }}
    >
      <BaraProgres
        pas={stareProgres.pas}
        total={stareProgres.totalPasi}
        procent={stareProgres.procent}
        titlu={BLOCURI[pas.bloc]}
      />

      <div className="space-y-6 rounded-lg border bg-white p-5 shadow-sm md:p-8">
        <h1 ref={titluRef} tabIndex={-1} className="text-xl font-semibold text-primary outline-none md:text-2xl">
          {BLOCURI[pas.bloc]}
        </h1>
        {estePrimulPasDinBloc && intro && <p className="text-gray-700">{intro}</p>}

        {campuri.map((camp) => (
          <CampIntrebare
            key={camp.id}
            camp={camp}
            text={textCamp(camp.id, config.interviu.varianta)}
            valoare={raspunsuri[camp.id]}
            eroare={erori[camp.id]}
            onSchimba={(valoare) => schimba(camp.id, valoare)}
          />
        ))}

        {esteUltimulPas && <Capcana valoare={capcana} onSchimba={setCapcana} />}
      </div>

      <div aria-live="assertive">
        {eroareTrimitere && (
          <Alert variant="destructive">
            <AlertDescription className="space-y-2 text-base">
              <p>{eroareTrimitere}</p>
              <p>
                {UI.eroareAlternativa}{" "}
                <Link href="/contact" target="_blank" className="font-medium underline underline-offset-4">
                  {UI.contact}
                </Link>
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button type="button" variant="ghost" onClick={inapoi} disabled={seTrimite}>
          <ArrowLeft aria-hidden="true" />
          {UI.inapoi}
        </Button>
        {esteUltimulPas ? (
          <Button type="submit" size="lg" disabled={seTrimite}>
            {seTrimite ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
            {seTrimite ? UI.seTrimite : config.interviu.trimitereActiva ? UI.trimite : UI.finalizeaza}
          </Button>
        ) : (
          <Button type="submit" size="lg">
            {UI.continua}
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </form>
  )
}
