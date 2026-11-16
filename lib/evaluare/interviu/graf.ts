// Navigarea prin graf: ce pași și câmpuri sunt vizibili, validare, opriri și progres.
// Funcții pure, fără React.

import { FRECVENTE, type ConfigEvaluare, type IdFrecventa } from "../config"
import { imc, varstaInAni } from "../formule"
import { verificaOpriri } from "../opriri"
import type { Oprire } from "../tipuri"
import { PASI, SCOFF_IDS, type Camp, type Pas } from "./intrebari"
import { antrenamente, esteDa, esteGol, numar, parseazaNumar, text, type Raspunsuri } from "./raspunsuri"
import { BLOCURI, ERORI, type IdBloc } from "./texte"

export function campuriVizibile(pas: Pas, r: Raspunsuri, config: ConfigEvaluare): Camp[] {
  return pas.campuri.filter((camp) => (camp.vizibil ? camp.vizibil(r, config) : true))
}

/** Pașii care au cel puțin un câmp vizibil, în ordinea grafului. */
export function pasiVizibili(r: Raspunsuri, config: ConfigEvaluare): Pas[] {
  return PASI.filter((pas) => campuriVizibile(pas, r, config).length > 0)
}

/**
 * Doar răspunsurile la câmpurile vizibile acum. Un răspuns dat la un detaliu care între timp
 * a dispărut (de ex. „ce fel de carne”, după ce poarta a devenit „nu”) nu ajunge în fișă.
 */
export function raspunsuriActive(r: Raspunsuri, config: ConfigEvaluare): Raspunsuri {
  const active: Raspunsuri = {}
  for (const pas of PASI) {
    for (const camp of campuriVizibile(pas, r, config)) {
      if (!esteGol(r[camp.id])) active[camp.id] = r[camp.id]
    }
  }
  return active
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
  const varsta = text(a, "data_nasterii") ? varstaInAni(text(a, "data_nasterii"), azi) : null
  const inaltime = numar(a, "inaltime")
  const greutate = numar(a, "greutate")
  const opriri = verificaOpriri({
    varstaAni: varsta ?? undefined,
    sarcinaSauAlaptare: esteDa(a, "sarcina_alaptare"),
    diabetCuInsulina: esteDa(a, "diabet") && esteDa(a, "insulina"),
    imc: inaltime && greutate ? imc(greutate, inaltime) : undefined,
    scoffRaspunsuriDa: numaraScoff(a),
  })
  return opriri[0] ?? null
}

export function numaraScoff(r: Raspunsuri): number {
  return SCOFF_IDS.filter((id) => esteDa(r, id)).length
}

export interface Progres {
  blocuri: { id: IdBloc; titlu: string; stare: "terminat" | "curent" | "urmeaza" }[]
  indexBloc: number
  totalBlocuri: number
  /** 0–100, după pașii vizibili parcurși. */
  procent: number
}

export function progres(idPasCurent: string, r: Raspunsuri, config: ConfigEvaluare): Progres {
  const pasi = pasiVizibili(r, config)
  const index = Math.max(
    0,
    pasi.findIndex((p) => p.id === idPasCurent),
  )
  const idBlocuri = (Object.keys(BLOCURI) as IdBloc[]).filter((id) => pasi.some((p) => p.bloc === id))
  const indexBloc = Math.max(0, idBlocuri.indexOf(pasi[index]?.bloc ?? idBlocuri[0]))
  return {
    blocuri: idBlocuri.map((id, i) => ({
      id,
      titlu: BLOCURI[id],
      stare: i < indexBloc ? "terminat" : i === indexBloc ? "curent" : "urmeaza",
    })),
    indexBloc,
    totalBlocuri: idBlocuri.length,
    procent: pasi.length === 0 ? 0 : Math.round((index / pasi.length) * 100),
  }
}

/** Numărul de ori pe săptămână pentru o etichetă de frecvență; undefined dacă lipsește. */
export function frecventaPeSaptamana(r: Raspunsuri, id: string): number | undefined {
  const eticheta = text(r, id)
  return eticheta in FRECVENTE ? FRECVENTE[eticheta as IdFrecventa] : undefined
}
