// Ce face serverul cu o cerere de trimitere, fără I/O: verifică acordul și capcana anti-spam,
// validează din nou răspunsurile, caută opririle de siguranță, calculează fișa și compune
// emailul. Ruta (app/api/evaluare/route.ts) doar citește cererea și trimite ce iese de aici.
//
// Nimic din ce a scris clienta nu este de încredere: validarea din browser se repetă integral.

import type { ConfigEvaluare } from "../config"
import { eroriPas, esteContactValid, oprireDinRaspunsuri, pasiVizibili, raspunsuriActive } from "../interviu/graf"
import { LIMITE_TEXT, pasiInterviu } from "../interviu/intrebari"
import type { RandAntrenament, Raspunsuri, Valoare } from "../interviu/raspunsuri"
import type { TipOprire } from "../tipuri"
import { calculeazaDinRaspunsuri, compuneEmailContact, compuneEmailEvaluare, type Email } from "./fisa-email"
import { CAMP_CAPCANA, type CodRefuz } from "./protocol"

export type RezultatCerere =
  /** Totul este în regulă: emailul poate pleca. */
  | { stare: "trimite"; tip: "evaluare" | "contact"; email: Email }
  /** Capcana anti-spam a fost completată: răspundem ca la succes, dar nu trimitem nimic. */
  | { stare: "ignora" }
  | { stare: "refuz"; status: number; cod: CodRefuz; oprire?: TipOprire }

const refuz = (status: number, cod: CodRefuz, oprire?: TipOprire): RezultatCerere => ({
  stare: "refuz",
  status,
  cod,
  oprire,
})

function esteObiect(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

// Caractere de control, mai puțin tab și rând nou.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

function curataText(v: string, peMaiMulteRanduri: boolean): string {
  const curat = v.replace(/\r\n?/g, "\n").replace(CONTROL, "")
  return (peMaiMulteRanduri ? curat : curat.replace(/[\n\t]+/g, " ")).trim()
}

const INTENSITATI = ["", "usoara", "moderata", "intensa"]

function curataAntrenamente(v: unknown): RandAntrenament[] | null {
  if (!Array.isArray(v) || v.length > 12) return null
  const randuri: RandAntrenament[] = []
  for (const rand of v) {
    if (!esteObiect(rand)) return null
    const { tip, ori, durata, intensitate } = rand
    if (typeof tip !== "string" || typeof ori !== "string" || typeof durata !== "string") return null
    if (typeof intensitate !== "string" || !INTENSITATI.includes(intensitate)) return null
    if (tip.length > 100 || ori.length > 5 || durata.length > 5) return null
    randuri.push({
      tip: curataText(tip, false),
      ori: ori.trim(),
      durata: durata.trim(),
      intensitate: intensitate as RandAntrenament["intensitate"],
    })
  }
  return randuri
}

/**
 * Păstrează doar răspunsurile la câmpurile cunoscute ale variantei de interviu active, cu tipul
 * potrivit. Întoarce null dacă o valoare are altă formă decât cea pe care o poate trimite interfața.
 */
export function curataRaspunsuri(brut: unknown, config: ConfigEvaluare): Raspunsuri | null {
  if (!esteObiect(brut)) return null
  const curate: Raspunsuri = {}
  for (const camp of pasiInterviu(config).flatMap((p) => p.campuri)) {
    const v = brut[camp.id]
    if (v === undefined || v === null) continue
    let valoare: Valoare
    if (camp.tip === "antrenamente") {
      const randuri = curataAntrenamente(v)
      if (!randuri) return null
      valoare = randuri
    } else if (camp.tip === "alegere_multipla") {
      if (!Array.isArray(v) || v.length > 20) return null
      if (!v.every((x): x is string => typeof x === "string" && x.length <= 40)) return null
      valoare = [...new Set(v)]
    } else {
      if (typeof v !== "string") return null
      const lung = camp.tip === "text_lung"
      if (v.length > LIMITE_TEXT[lung ? "text_lung" : "text"]) return null
      valoare = curataText(v, lung)
    }
    curate[camp.id] = valoare
  }
  return curate
}

/**
 * @param corp corpul cererii, deja citit ca JSON
 * @param azi data serverului (pentru vârsta din data nașterii și pentru antetul fișei)
 */
export function proceseazaCerere(corp: unknown, config: ConfigEvaluare, azi: Date): RezultatCerere {
  if (!esteObiect(corp) || (corp.tip !== "evaluare" && corp.tip !== "contact")) return refuz(400, "cerere_invalida")
  if (!config.interviu.trimitereActiva) return refuz(503, "trimitere_inactiva")

  // Fără acord explicit nu se trimite nimic, indiferent ce altceva conține cererea.
  if (corp.consimtamant !== true) return refuz(403, "fara_consimtamant")

  const capcana = corp[CAMP_CAPCANA]
  if (capcana !== undefined && capcana !== "") return { stare: "ignora" }

  if (corp.tip === "contact") {
    if (typeof corp.nume !== "string" || typeof corp.contact !== "string") return refuz(400, "cerere_invalida")
    if (corp.nume.length > LIMITE_TEXT.text || corp.contact.length > LIMITE_TEXT.text) return refuz(422, "contact_invalid")
    const nume = curataText(corp.nume, false)
    const contact = curataText(corp.contact, false)
    if (nume.length < 2 || !esteContactValid(contact)) return refuz(422, "contact_invalid")
    return { stare: "trimite", tip: "contact", email: compuneEmailContact({ nume, contact }, azi) }
  }

  const curate = curataRaspunsuri(corp.raspunsuri, config)
  if (!curate) return refuz(422, "raspunsuri_invalide")
  const raspunsuri = raspunsuriActive(curate, config)

  // Opririle de siguranță se verifică înaintea validării complete: la o oprire, interviul se
  // încheie devreme, deci răspunsurile sunt în mod firesc incomplete. Nimic nu se trimite.
  const oprire = oprireDinRaspunsuri(raspunsuri, config, azi)
  if (oprire) return refuz(422, "oprire", oprire.tip)

  const areErori = pasiVizibili(raspunsuri, config).some(
    (pas) => Object.keys(eroriPas(pas, raspunsuri, config, azi)).length > 0,
  )
  if (areErori) return refuz(422, "raspunsuri_invalide")

  const rezultat = calculeazaDinRaspunsuri(raspunsuri, config, azi)
  if (!rezultat) return refuz(422, "raspunsuri_invalide")
  // A doua plasă: motorul verifică aceleași opriri înaintea oricărui calcul.
  if (rezultat.stare === "oprit") return refuz(422, "oprire", rezultat.opriri[0]?.tip)

  return { stare: "trimite", tip: "evaluare", email: compuneEmailEvaluare(raspunsuri, rezultat, config, azi) }
}
