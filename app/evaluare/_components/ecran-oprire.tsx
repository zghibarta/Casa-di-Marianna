"use client"

// Oprirea blândă: recomandare de consult medical, fără plan și fără cifre. Persoana poate lăsa
// doar numele și contactul, ca să fie sunată; răspunsurile medicale nu pleacă nicăieri.

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CONFIG_IMPLICIT } from "@/lib/evaluare/config"
import { esteContactValid } from "@/lib/evaluare/interviu/graf"
import { LIMITE_TEXT } from "@/lib/evaluare/interviu/intrebari"
import { CAMPURI, ERORI, OPRIRI, UI } from "@/lib/evaluare/interviu/texte"
import { Capcana } from "./capcana"
import { useEvaluare } from "./stare"
import { mesajEroare, trimiteLaServer } from "./trimite"

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
  // Sub 18 ani nu cerem și nu trimitem nimic.
  const cuContact = !minor && config.interviu.trimitereActiva

  return (
    <div className="space-y-6">
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
          {minor ? UI.oprireMinor : `${UI.oprireNetrimis}${cuContact ? "" : ` ${UI.oprireFaraTrimitere}`}`}
        </p>
        {!minor && !cuContact && (
          <Button asChild>
            <Link href="/contact">{UI.contact}</Link>
          </Button>
        )}
      </div>

      {cuContact && <CerereContact consimtamant={stare.consimtamant?.sanatate === true} />}

      <Button variant="ghost" onClick={() => (minor ? reseteaza() : actualizeaza({ etapa: "interviu", oprire: null }))}>
        {UI.oprireGreseala}
      </Button>
    </div>
  )
}

/** Trimite doar numele și contactul. Răspunsurile din interviu nu intră în această cerere. */
function CerereContact({ consimtamant }: { consimtamant: boolean }) {
  const [nume, setNume] = useState("")
  const [contact, setContact] = useState("")
  const [capcana, setCapcana] = useState("")
  const [erori, setErori] = useState<{ nume?: string; contact?: string }>({})
  const [stareTrimitere, setStareTrimitere] = useState<"inactiv" | "in_curs" | "trimis">("inactiv")
  const [eroare, setEroare] = useState<string | null>(null)

  const trimite = async () => {
    const eroriNoi = {
      nume: nume.trim().length < 2 ? ERORI.obligatoriu : undefined,
      contact: contact.trim() === "" ? ERORI.obligatoriu : esteContactValid(contact) ? undefined : ERORI.contact,
    }
    setErori(eroriNoi)
    if (eroriNoi.nume || eroriNoi.contact) return
    setStareTrimitere("in_curs")
    setEroare(null)
    const rezultat = await trimiteLaServer({ tip: "contact", consimtamant, nume, contact, website: capcana })
    if (rezultat.ok) {
      setStareTrimitere("trimis")
      return
    }
    setStareTrimitere("inactiv")
    setEroare(mesajEroare(rezultat.cod))
  }

  if (stareTrimitere === "trimis") {
    return (
      <Alert>
        <AlertDescription className="text-base" role="status">
          {UI.oprireContactTrimis}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form
      noValidate
      className="relative space-y-4 rounded-lg border bg-white p-5 shadow-sm md:p-8"
      onSubmit={(e) => {
        e.preventDefault()
        void trimite()
      }}
    >
      <h2 className="text-xl font-semibold md:text-2xl">{UI.oprireContactTitlu}</h2>
      <p className="text-gray-700">{UI.oprireContactIntro}</p>

      <div className="space-y-2">
        <Label htmlFor="oprire-nume" className="text-base">
          {CAMPURI.nume.intrebare}
        </Label>
        <Input
          id="oprire-nume"
          value={nume}
          maxLength={LIMITE_TEXT.text}
          autoComplete="name"
          placeholder={CAMPURI.nume.substituent}
          aria-invalid={erori.nume ? true : undefined}
          aria-describedby={erori.nume ? "oprire-nume-eroare" : undefined}
          className="bg-white"
          onChange={(e) => setNume(e.target.value)}
        />
        {erori.nume && (
          <p id="oprire-nume-eroare" role="alert" className="text-sm font-medium text-destructive">
            {erori.nume}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="oprire-contact" className="text-base">
          {CAMPURI.contact.intrebare}
        </Label>
        <Input
          id="oprire-contact"
          value={contact}
          maxLength={LIMITE_TEXT.text}
          autoComplete="off"
          aria-invalid={erori.contact ? true : undefined}
          aria-describedby={erori.contact ? "oprire-contact-ajutor oprire-contact-eroare" : "oprire-contact-ajutor"}
          className="bg-white"
          onChange={(e) => setContact(e.target.value)}
        />
        <p id="oprire-contact-ajutor" className="text-sm text-muted-foreground">
          {CAMPURI.contact.ajutor}
        </p>
        {erori.contact && (
          <p id="oprire-contact-eroare" role="alert" className="text-sm font-medium text-destructive">
            {erori.contact}
          </p>
        )}
      </div>

      <Capcana valoare={capcana} onSchimba={setCapcana} />

      <div aria-live="assertive">
        {eroare && (
          <Alert variant="destructive">
            <AlertDescription className="space-y-2 text-base">
              <p>{eroare}</p>
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

      <Button type="submit" disabled={stareTrimitere === "in_curs"}>
        {stareTrimitere === "in_curs" && <Loader2 className="animate-spin" aria-hidden="true" />}
        {stareTrimitere === "in_curs" ? UI.seTrimite : UI.oprireContactButon}
      </Button>
    </form>
  )
}
