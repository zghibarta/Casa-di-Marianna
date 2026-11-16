// Fișa pentru Mariana, ca text simplu, așa cum pleacă pe email. Funcții pure: nu trimit nimic.
//
// Reguli: subiectul conține doar prenumele (nicio dată medicală), iar corpul are patru părți:
// date de bază, semnale de atenție, calcul, răspunsuri.

import { calculeazaFisa } from "../calcul"
import { TRIMITERE, type ConfigEvaluare } from "../config"
import { randuriCalcul, valoriDeConfirmat } from "../fisa"
import { construiesteIntrare, randuriFisa, type RandFisa } from "../interviu/mapare"
import { text, type Raspunsuri } from "../interviu/raspunsuri"
import { NEINTREBATE_SCURT } from "../interviu/texte"
import type { RezultatCalcul } from "../tipuri"

export interface Email {
  subiect: string
  text: string
}

const LINIE = "-".repeat(60)

/** Primul cuvânt din nume, doar litere, pentru subiect. Fără date medicale și fără caractere de control. */
export function prenumeDinNume(nume: string): string {
  const prenume = nume
    .replace(/[^\p{L}\p{M}'’ -]/gu, " ")
    .trim()
    .split(/\s+/)[0]
  return prenume ? prenume.slice(0, 40) : "fără nume"
}

function dataPrimirii(azi: Date): string {
  const data = new Intl.DateTimeFormat("ro-RO", {
    timeZone: TRIMITERE.fusOrar,
    dateStyle: "long",
    timeStyle: "short",
  }).format(azi)
  return `${data} (${TRIMITERE.fusOrar})`
}

/** Un rând „Etichetă: valoare”; textele pe mai multe rânduri sunt aliniate sub prima linie. */
function rand(eticheta: string, valoare: string): string {
  return `${eticheta}: ${valoare.split("\n").join("\n    ")}`
}

function sectiune(titlu: string, linii: string[]): string {
  return [LINIE, titlu, LINIE, ...linii].join("\n")
}

/** Fișa completă. `rezultat` trebuie să fie un calcul reușit: la oprire nu se compune nimic. */
export function compuneEmailEvaluare(
  raspunsuri: Raspunsuri,
  rezultat: RezultatCalcul,
  config: ConfigEvaluare,
  azi: Date,
): Email {
  if (rezultat.stare !== "calculat") {
    throw new Error("Fișa nu se trimite când există o oprire de siguranță.")
  }
  const randuri = randuriFisa(raspunsuri, config)
  const raspuns = (id: string) => randuri.find((x) => x.id === id)?.raspuns ?? "—"
  const scurt = config.interviu.varianta === "scurt"
  const nume = text(raspunsuri, "nume")

  const antet = [
    "EVALUARE NUTRIȚIONALĂ INIȚIALĂ – Casa di Marianna",
    rand("Primită", dataPrimirii(azi)),
    rand("Consimțământ", `acordat pe site înainte de interviu (textul „${config.interviu.versiuneConsimtamant}”)`),
    rand("Interviu", `varianta ${scurt ? "scurtă" : "completă"}; configurare ${rezultat.versiuneConfig}`),
    "Fișa a fost trimisă doar pe email. Nu este salvată pe site.",
  ].join("\n")

  const baza = sectiune("1. DATE DE BAZĂ", [
    rand("Nume", nume || "—"),
    rand("Contact", raspuns("contact")),
    rand("Vârstă", raspunsuri.varsta !== undefined ? raspuns("varsta") : `${raspuns("data_nasterii")} (data nașterii)`),
    rand("Sex", raspuns("sex")),
    rand("Înălțime", raspuns("inaltime")),
    rand("Greutate", raspuns("greutate")),
    rand("Scop", raspuns("scopuri")),
    rand("Mesaj", raspuns(scurt ? "mesaj" : "informatii")),
  ])

  const semnale = sectiune(
    "2. SEMNALE DE ATENȚIE",
    rezultat.semnale.length === 0
      ? ["Niciun semnal."]
      : [
          ...rezultat.semnale.filter((s) => s.nivel === "atentie").map((s) => `[ATENȚIE] ${s.mesaj}`),
          ...rezultat.semnale.filter((s) => s.nivel === "informativ").map((s) => `[informativ] ${s.mesaj}`),
        ],
  )

  const deConfirmat = valoriDeConfirmat(rezultat, config)
  const calcul = sectiune("3. CALCUL (orientativ; cifrele se confirmă la consultație)", [
    ...randuriCalcul(rezultat).map((r) => rand(r.eticheta, r.valoare)),
    ...(deConfirmat.length > 0
      ? ["", "Valori implicite sau estimate, DE CONFIRMAT LA CONSULTAȚIE:", ...deConfirmat.map((n) => `- ${n}`)]
      : []),
    ...(scurt
      ? ["", `Neîntrebat în interviul scurt, de discutat la consultație: ${NEINTREBATE_SCURT.join(", ")}.`]
      : []),
  ])

  return {
    subiect: `Evaluare nouă - ${prenumeDinNume(nume)}`,
    text: [antet, baza, semnale, calcul, sectiune("4. RĂSPUNSURI", liniiRaspunsuri(randuri))].join("\n\n") + "\n",
  }
}

/** Răspunsurile grupate pe blocuri. Numele și contactul apar doar la datele de bază. */
function liniiRaspunsuri(randuri: RandFisa[]): string[] {
  const linii: string[] = []
  let bloc = ""
  for (const r of randuri) {
    if (r.id === "nume" || r.id === "contact") continue
    if (r.bloc !== bloc) {
      if (linii.length > 0) linii.push("")
      linii.push(`[${r.bloc}]`)
      bloc = r.bloc
    }
    linii.push(`- ${rand(r.intrebare, r.raspuns)}`)
  }
  return linii
}

/**
 * Cererea de contact de după o oprire de siguranță: doar numele și contactul. Nu primește și nu
 * conține niciun răspuns din interviu și nici motivul opririi.
 */
export function compuneEmailContact(date: { nume: string; contact: string }, azi: Date): Email {
  return {
    subiect: `Cerere de contact - ${prenumeDinNume(date.nume)}`,
    text:
      [
        "CERERE DE CONTACT – Casa di Marianna",
        rand("Primită", dataPrimirii(azi)),
        "",
        rand("Nume", date.nume),
        rand("Contact", date.contact),
        "",
        "Interviul de evaluare s-a încheiat cu recomandarea de a vorbi mai întâi cu medicul,",
        "iar persoana a cerut să fie contactată. Răspunsurile din interviu și motivul",
        "recomandării nu au fost trimise și nu sunt salvate nicăieri.",
      ].join("\n") + "\n",
  }
}

/** Calculează fișa din răspunsuri; null dacă lipsesc datele de bază sau motorul le respinge. */
export function calculeazaDinRaspunsuri(
  raspunsuri: Raspunsuri,
  config: ConfigEvaluare,
  azi: Date,
): RezultatCalcul | null {
  const intrare = construiesteIntrare(raspunsuri, config, { azi })
  if (!intrare) return null
  try {
    return calculeazaFisa(intrare, config)
  } catch {
    return null
  }
}
