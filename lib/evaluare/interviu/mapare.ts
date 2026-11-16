// Din răspunsurile interviului construiește intrarea motorului de calcul și
// lista de răspunsuri pentru fișa Marianei.

import type { ConfigEvaluare } from "../config"
import { fmtNumar } from "../afisare"
import { varstaInAni } from "../formule"
import type { Antrenament, Autoapreciere, IntrareCalcul, Masuratori, Sex } from "../tipuri"
import { campuriVizibile, frecventaPeSaptamana, numaraScoff, raspunsuriActive } from "./graf"
import { PASI, type Camp } from "./intrebari"
import { antrenamente, esteDa, esteGol, lista, numar, parseazaNumar, text, type Raspunsuri } from "./raspunsuri"
import { BLOCURI, CAMPURI, OPTIUNI } from "./texte"

const SAPTAMANI_PE_LUNA = 52 / 12

/** Orele de somn din ora de culcare și cea de trezire (HH:MM); undefined dacă lipsesc. */
export function oreDeSomn(oraCulcare: string, oraTrezire: string): number | undefined {
  const minute = (ora: string) => {
    const p = /^(\d{2}):(\d{2})$/.exec(ora)
    return p ? Number(p[1]) * 60 + Number(p[2]) : undefined
  }
  const culcare = minute(oraCulcare)
  const trezire = minute(oraTrezire)
  if (culcare === undefined || trezire === undefined) return undefined
  return (((trezire - culcare) % 1440) + 1440) % 1440 / 60
}

export function antrenamenteDinRaspunsuri(r: Raspunsuri): Antrenament[] {
  return antrenamente(r, "antrenamente")
    .map((rand) => ({
      tip: rand.tip.trim(),
      oriPeSaptamana: parseazaNumar(rand.ori) ?? 0,
      durataMinute: parseazaNumar(rand.durata),
      intensitate: rand.intensitate === "" ? ("moderata" as const) : rand.intensitate,
    }))
    .filter((a) => a.tip !== "" && a.oriPeSaptamana > 0)
}

export interface OptiuniMapare {
  azi: Date
  /** Introduse de Mariana după măsurare (în Faza 1, din ecranul de debug). */
  masuratori?: Masuratori
  /** Coeficient confirmat de Mariana. */
  coefActivitate?: number
}

/** null dacă lipsesc datele de bază (data nașterii, sex, înălțime, greutate). */
export function construiesteIntrare(
  raspunsuri: Raspunsuri,
  config: ConfigEvaluare,
  optiuni: OptiuniMapare,
): IntrareCalcul | null {
  const r = raspunsuriActive(raspunsuri, config)
  const varsta = varstaInAni(text(r, "data_nasterii"), optiuni.azi)
  const sex = text(r, "sex")
  const inaltime = numar(r, "inaltime")
  const greutate = numar(r, "greutate")
  if (varsta === null || (sex !== "F" && sex !== "B") || !inaltime || !greutate) return null

  const scopSlabire = lista(r, "scopuri").includes("slabire")
  const kgDorite = numar(r, "scop_slabire_kg")
  const luniDorite = numar(r, "scop_slabire_luni")
  const autoapreciere = text(r, "activitate_auto")
  const motivatii = [numar(r, "motivatie_schimbare"), numar(r, "motivatie_recomandari")].filter(
    (v): v is number => v !== undefined,
  )

  return {
    sex: sex as Sex,
    varstaAni: varsta,
    inaltimeCm: inaltime,
    greutateKg: greutate,
    scopSlabire,
    coefActivitate: optiuni.coefActivitate,
    activitate:
      autoapreciere === ""
        ? undefined
        : { autoapreciere: autoapreciere as Autoapreciere, antrenamente: antrenamenteDinRaspunsuri(r) },
    masuratori: optiuni.masuratori,
    ritmDoritKgPeSaptamana:
      scopSlabire && kgDorite && luniDorite ? kgDorite / (luniDorite * SAPTAMANI_PE_LUNA) : undefined,
    sarcinaSauAlaptare: esteDa(r, "sarcina_alaptare"),
    diabetCuInsulina: esteDa(r, "diabet") && esteDa(r, "insulina"),
    scoffRaspunsuriDa: numaraScoff(r),
    context: {
      boliCronice: esteDa(r, "boli_cronice"),
      tratament: esteDa(r, "tratament"),
      alergii: esteDa(r, "alergii"),
      interventii: esteDa(r, "interventii"),
      suplimente: esteDa(r, "suplimente"),
      fumat: esteDa(r, "fumat"),
      alcoolPeSaptamana: frecventaPeSaptamana(r, "alcool_frecventa"),
      somnOre: oreDeSomn(text(r, "ora_culcare"), text(r, "ora_trezire")),
      apaLitri: numar(r, "apa_litri"),
      motivatieMinima: motivatii.length > 0 ? Math.min(...motivatii) : undefined,
    },
  }
}

// ---------- răspunsurile, formatate pentru fișă ----------

function eticheta(camp: Camp, valoare: string): string {
  const set = camp.tip === "da_nu" ? OPTIUNI.da_nu : camp.optiuni ? OPTIUNI[camp.optiuni] : []
  return set.find((opt) => opt.valoare === valoare)?.eticheta ?? valoare
}

export function formateazaRaspuns(camp: Camp, r: Raspunsuri): string {
  const v = r[camp.id]
  if (esteGol(v)) return "—"
  switch (camp.tip) {
    case "antrenamente":
      return (
        antrenamenteDinRaspunsuri(r)
          .map(
            (a) =>
              `${a.tip}: de ${fmtNumar(a.oriPeSaptamana, 0)} ori/săpt.` +
              (a.durataMinute ? `, ${fmtNumar(a.durataMinute, 0)} min` : "") +
              `, intensitate ${eticheta({ ...camp, optiuni: "intensitate" }, a.intensitate).toLowerCase()}`,
          )
          .join("; ") || "—"
      )
    case "alegere_multipla":
      return lista(r, camp.id)
        .map((x) => eticheta(camp, x))
        .join(", ")
    case "frecventa": {
      const ori = frecventaPeSaptamana(r, camp.id)
      return `${eticheta(camp, text(r, camp.id))}${ori === undefined ? "" : ` [${fmtNumar(ori, 1)}/săpt.]`}`
    }
    case "da_nu":
    case "alegere":
      return eticheta(camp, text(r, camp.id))
    case "numar":
      return `${text(r, camp.id)}${camp.unitate ? ` ${camp.unitate}` : ""}`
    case "scala":
      return `${text(r, camp.id)} din ${camp.max ?? 10}`
    default:
      return text(r, camp.id)
  }
}

export interface RandFisa {
  /** Id-ul câmpului: mai multe întrebări au aceeași formulare („Cât de des?”). */
  id: string
  bloc: string
  intrebare: string
  raspuns: string
}

/** Toate întrebările vizibile, cu răspunsul formatat, în ordinea grafului. */
export function randuriFisa(raspunsuri: Raspunsuri, config: ConfigEvaluare): RandFisa[] {
  const randuri: RandFisa[] = []
  for (const pas of PASI) {
    for (const camp of campuriVizibile(pas, raspunsuri, config)) {
      randuri.push({
        id: camp.id,
        bloc: BLOCURI[pas.bloc],
        intrebare: CAMPURI[camp.id]?.intrebare ?? camp.id,
        raspuns: formateazaRaspuns(camp, raspunsuri),
      })
    }
  }
  return randuri
}
