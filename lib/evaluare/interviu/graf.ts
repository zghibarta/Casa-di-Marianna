// Navigarea prin graf: ce pași și câmpuri sunt vizibili, validare, opriri și progres.
// Funcții pure, fără React.

import { FRECVENTE, type ConfigEvaluare, type IdFrecventa } from "../config"
import { imc, varstaInAni } from "../formule"
import { verificaOpriri } from "../opriri"
import type { Oprire } from "../tipuri"
import { LIMITE_TEXT, SCOFF_IDS, pasiInterviu, type Camp, type Pas } from "./intrebari"
import { antrenamente, esteDa, esteGol, lista, numar, parseazaNumar, text, type Raspunsuri } from "./raspunsuri"
import { BLOCURI, ERORI, OPTIUNI, type IdBloc, type Optiune } from "./texte"

export function campuriVizibile(pas: Pas, r: Raspunsuri, config: ConfigEvaluare): Camp[] {
  return pas.campuri.filter((camp) => (camp.vizibil ? camp.vizibil(r, config) : true))
}

/** Pașii care au cel puțin un câmp vizibil, în ordinea grafului. */
export function pasiVizibili(r: Raspunsuri, config: ConfigEvaluare): Pas[] {
  return pasiInterviu(config).filter((pas) => campuriVizibile(pas, r, config).length > 0)
}

/**
 * Doar răspunsurile la câmpurile vizibile acum. Un răspuns dat la un detaliu care între timp
 * a dispărut (de ex. „ce fel de carne”, după ce poarta a devenit „nu”) nu ajunge în fișă.
 */
export function raspunsuriActive(r: Raspunsuri, config: ConfigEvaluare): Raspunsuri {
  const active: Raspunsuri = {}
  for (const pas of pasiInterviu(config)) {
    for (const camp of campuriVizibile(pas, r, config)) {
      if (!esteGol(r[camp.id])) active[camp.id] = r[camp.id]
    }
  }
  return active
}

export function optiuniCamp(camp: Camp): Optiune[] {
  if (camp.tip === "da_nu") return OPTIUNI.da_nu
  return camp.optiuni ? OPTIUNI[camp.optiuni] : []
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Un număr de telefon (cel puțin 6 cifre) sau o adresă de email. */
export function esteContactValid(valoare: string): boolean {
  const v = valoare.trim()
  return EMAIL.test(v) || (v.match(/\d/g) ?? []).length >= 6
}

function eroareCamp(camp: Camp, r: Raspunsuri, azi: Date): string | null {
  const v = r[camp.id]
  if (camp.tip === "antrenamente") {
    for (const rand of antrenamente(r, camp.id)) {
      if (rand.tip.trim() === "") continue
      const ori = parseazaNumar(rand.ori)
      if (ori === undefined || ori < 1 || ori > 14 || rand.intensitate === "") return ERORI.antrenament
    }
    return null
  }
  if (esteGol(v)) return camp.obligatoriu ? ERORI.obligatoriu : null

  if (camp.tip === "numar" || camp.tip === "scala") {
    const n = numar(r, camp.id)
    if (n === undefined) return ERORI.numar
    const min = camp.min ?? Number.NEGATIVE_INFINITY
    const max = camp.max ?? Number.POSITIVE_INFINITY
    if (n < min || n > max) return ERORI.interval(camp.min ?? 0, camp.max ?? 0)
  }
  if (camp.tip === "data") {
    const varsta = varstaInAni(text(r, camp.id), azi)
    if (varsta === null || varsta < 0 || varsta > 120) return ERORI.data
  }
  if (camp.tip === "ora" && !/^\d{2}:\d{2}$/.test(text(r, camp.id))) return ERORI.ora

  if (camp.tip === "text" || camp.tip === "text_lung") {
    if (typeof v !== "string") return ERORI.obligatoriu
    const max = LIMITE_TEXT[camp.tip]
    if (v.length > max) return ERORI.preaLung(max)
    if (camp.format === "contact" && !esteContactValid(v)) return ERORI.contact
  }
  // Interfața nu poate trimite altceva decât opțiunile afișate; serverul verifică din nou.
  if (camp.tip === "da_nu" || camp.tip === "alegere" || camp.tip === "frecventa") {
    if (!optiuniCamp(camp).some((opt) => opt.valoare === v)) return ERORI.optiune
  }
  if (camp.tip === "alegere_multipla") {
    const alese = lista(r, camp.id)
    const permise = optiuniCamp(camp).map((opt) => opt.valoare)
    if (!Array.isArray(v) || alese.length !== v.length || alese.some((x) => !permise.includes(x))) return ERORI.optiune
    if (camp.exclusiv && alese.includes(camp.exclusiv) && alese.length > 1) return ERORI.optiune
  }
  return null
}

/** Erorile pasului, pe id de câmp. Obiect gol = se poate continua. */
export function eroriPas(pas: Pas, r: Raspunsuri, config: ConfigEvaluare, azi: Date): Record<string, string> {
  const erori: Record<string, string> = {}
  for (const camp of campuriVizibile(pas, r, config)) {
    const eroare = eroareCamp(camp, r, azi)
    if (eroare) erori[camp.id] = eroare
  }
  return erori
}

/**
 * Prima oprire de siguranță care reiese din răspunsurile de până acum, sau null.
 * Folosește aceeași funcție ca motorul de calcul, deci regulile nu pot diverge.
 */
export function oprireDinRaspunsuri(r: Raspunsuri, config: ConfigEvaluare, azi: Date): Oprire | null {
  const a = raspunsuriActive(r, config)
  const inaltime = numar(a, "inaltime")
  const greutate = numar(a, "greutate")
  const opriri = verificaOpriri({
    varstaAni: varstaDinRaspunsuri(a, azi) ?? undefined,
    sarcinaSauAlaptare: esteDa(a, "sarcina_alaptare"),
    diabetCuInsulina: areDiabetCuInsulina(a),
    imc: inaltime && greutate ? imc(greutate, inaltime) : undefined,
    scoffRaspunsuriDa: numaraScoff(a),
  })
  return opriri[0] ?? null
}

/** Vârsta în ani: scrisă direct (interviul scurt) sau calculată din data nașterii (cel complet). */
export function varstaDinRaspunsuri(r: Raspunsuri, azi: Date): number | null {
  const scrisa = numar(r, "varsta")
  if (scrisa !== undefined) return scrisa
  return text(r, "data_nasterii") ? varstaInAni(text(r, "data_nasterii"), azi) : null
}

/** Diabetul vine din lista de afecțiuni (interviul scurt) sau din întrebarea dedicată (cel complet). */
export function areDiabetCuInsulina(r: Raspunsuri): boolean {
  const diabet = esteDa(r, "diabet") || lista(r, "afectiuni").includes("diabet")
  return diabet && esteDa(r, "insulina")
}

export function numaraScoff(r: Raspunsuri): number {
  return SCOFF_IDS.filter((id) => esteDa(r, id)).length
}

export interface Progres {
  blocuri: { id: IdBloc; titlu: string; stare: "terminat" | "curent" | "urmeaza" }[]
  indexBloc: number
  totalBlocuri: number
  /** Numărul ecranului curent, socotind consimțământul ca pasul 1. */
  pas: number
  /** Numărul total de ecrane, cu tot cu consimțământ. */
  totalPasi: number
  /** 0–100, după ecranele deja parcurse. */
  procent: number
}

/** Numărul de ecrane ale interviului, cu tot cu consimțământ (pentru „Pasul 1 din 10”). */
export function totalEcrane(r: Raspunsuri, config: ConfigEvaluare): number {
  return pasiVizibili(r, config).length + 1
}

export function progres(idPasCurent: string, r: Raspunsuri, config: ConfigEvaluare): Progres {
  const pasi = pasiVizibili(r, config)
  const index = Math.max(
    0,
    pasi.findIndex((p) => p.id === idPasCurent),
  )
  // Blocurile, în ordinea în care apar în varianta de interviu aleasă.
  const idBlocuri = [...new Set(pasi.map((p) => p.bloc))] as IdBloc[]
  const indexBloc = Math.max(0, idBlocuri.indexOf(pasi[index]?.bloc ?? idBlocuri[0]))
  return {
    blocuri: idBlocuri.map((id, i) => ({
      id,
      titlu: BLOCURI[id],
      stare: i < indexBloc ? "terminat" : i === indexBloc ? "curent" : "urmeaza",
    })),
    indexBloc,
    totalBlocuri: idBlocuri.length,
    pas: index + 2,
    totalPasi: pasi.length + 1,
    procent: Math.round(((index + 1) / (pasi.length + 1)) * 100),
  }
}

/** Numărul de ori pe săptămână pentru o etichetă de frecvență; undefined dacă lipsește. */
export function frecventaPeSaptamana(r: Raspunsuri, id: string): number | undefined {
  const eticheta = text(r, id)
  return eticheta in FRECVENTE ? FRECVENTE[eticheta as IdFrecventa] : undefined
}
