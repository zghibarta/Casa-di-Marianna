// Motorul de calcul: din IntrareCalcul produce fișa de cifre pentru Mariana.
// Funcții pure; precizie completă, rotunjirea se face doar în afisare.ts.

import { CONFIG_IMPLICIT, valideazaConfig, type ConfigEvaluare, type ConfigMetoda } from "./config"
import { fmtKcal, fmtNumar, fmtProcent } from "./afisare"
import { propuneCoeficient } from "./activitate"
import {
  clasaIMC,
  greutateDevine,
  greutateReferinta,
  harrisBenedict,
  imc,
  intervalGreutateSanatoasa,
  katchMcArdle,
  mifflinStJeor,
  pgcDeurenberg,
  pgcNavy,
} from "./formule"
import { verificaOpriri } from "./opriri"
import { semnal, semnaleContext, semnaleTalie } from "./semnale"
import type {
  Apa,
  Indicatori,
  IntrareCalcul,
  Macro,
  RezultatCalcul,
  RezultatRmb,
  Ritm,
  Semnal,
  Sex,
} from "./tipuri"

function valideazaIntrare(i: IntrareCalcul): void {
  const pozitiv = (v: number) => Number.isFinite(v) && v > 0
  if (!pozitiv(i.inaltimeCm)) throw new RangeError("inaltimeCm trebuie să fie un număr pozitiv")
  if (!pozitiv(i.greutateKg)) throw new RangeError("greutateKg trebuie să fie un număr pozitiv")
  if (!Number.isFinite(i.varstaAni) || i.varstaAni < 0) throw new RangeError("varstaAni trebuie să fie un număr ≥ 0")
  if (i.coefActivitate !== undefined && !pozitiv(i.coefActivitate)) {
    throw new RangeError("coefActivitate trebuie să fie un număr pozitiv")
  }
}

export function calculeazaIndicatori(intrare: IntrareCalcul, metoda: ConfigMetoda): Indicatori {
  const { sex, inaltimeCm, greutateKg, varstaAni, masuratori } = intrare
  const valoareImc = imc(greutateKg, inaltimeCm)
  const devineKg = greutateDevine(sex, inaltimeCm)
  const interval = intervalGreutateSanatoasa(inaltimeCm)
  const excesKg =
    metoda.reperGreutate === "A"
      ? devineKg === null
        ? null
        : greutateKg - devineKg
      : Math.max(0, greutateKg - interval[1])
  const talie = masuratori?.talie
  return {
    imc: valoareImc,
    clasaImc: clasaIMC(valoareImc),
    devineKg,
    intervalSanatosKg: interval,
    reper: { varianta: metoda.reperGreutate, excesKg },
    pgcDeurenberg: pgcDeurenberg(valoareImc, varstaAni, sex),
    pgcNavy: pgcNavy(sex, inaltimeCm, masuratori),
    talieInaltime: metoda.indicatoriTalie && talie !== undefined ? talie / inaltimeCm : null,
  }
}

export function calculeazaRmb(intrare: IntrareCalcul, indicatori: Indicatori, metoda: ConfigMetoda): RezultatRmb {
  const { sex, inaltimeCm, greutateKg, varstaAni } = intrare
  const hb = harrisBenedict(sex, greutateKg, inaltimeCm, varstaAni)
  const msj = mifflinStJeor(sex, greutateKg, inaltimeCm, varstaAni)
  const cuNavy = metoda.rmb === "B1" && indicatori.pgcNavy !== null
  const km = katchMcArdle(greutateKg, cuNavy ? (indicatori.pgcNavy as number) : indicatori.pgcDeurenberg)
  return {
    varianta: metoda.rmb,
    harrisBenedict: hb,
    mifflinStJeor: msj,
    katchMcArdle: km,
    pgcFolosit: cuNavy ? "navy" : "deurenberg",
    valoare: metoda.rmb === "B2" ? msj : (hb + msj + km) / 3,
  }
}

export interface RezultatTinta {
  tintaKcal: number
  deficitAplicat: boolean
  pragMinimAtins: boolean
}

/** Deficit doar dacă scopul include slăbirea și IMC ≥ 25; niciodată sub pragul minim. */
export function calculeazaTinta(
  mentinereKcal: number,
  d: { sex: Sex; imc: number; scopSlabire: boolean },
  metoda: ConfigMetoda,
): RezultatTinta {
  if (!d.scopSlabire || d.imc < metoda.imcMinimPentruDeficit) {
    return { tintaKcal: mentinereKcal, deficitAplicat: false, pragMinimAtins: false }
  }
  const prag = metoda.pragMinimKcal[d.sex]
  const cuDeficit = mentinereKcal - metoda.deficitKcal
  if (cuDeficit < prag) {
    // țintă = max(menținere − deficit, prag), exact ca în plan.md §4.
    return { tintaKcal: prag, deficitAplicat: true, pragMinimAtins: true }
  }
  return { tintaKcal: cuDeficit, deficitAplicat: true, pragMinimAtins: false }
}

/** Întoarce null când carbohidrații ies negativi: nu se poate face plan (protecție în ambele variante). */
export function calculeazaMacro(
  d: { greutateKg: number; inaltimeCm: number; tintaKcal: number },
  metoda: ConfigMetoda,
): Macro | null {
  const gRef = metoda.macro === "B" ? greutateReferinta(d.greutateKg, d.inaltimeCm) : d.greutateKg
  const proteineG = metoda.proteineGPeKg * gRef
  const grasimiG =
    metoda.macro === "B" ? (metoda.procentGrasimi * d.tintaKcal) / 9 : metoda.grasimiGPeKg * d.greutateKg
  const carbohidratiG = (d.tintaKcal - 4 * proteineG - 9 * grasimiG) / 4
  if (carbohidratiG < 0) return null
  return {
    varianta: metoda.macro,
    greutateReferintaKg: gRef,
    proteineG,
    grasimiG,
    carbohidratiG,
    procente: {
      proteine: (4 * proteineG) / d.tintaKcal,
      grasimi: (9 * grasimiG) / d.tintaKcal,
      carbohidrati: (4 * carbohidratiG) / d.tintaKcal,
    },
  }
}

export function calculeazaApa(d: { greutateKg: number; inaltimeCm: number }, metoda: ConfigMetoda): Apa {
  const g = metoda.apa === "B" ? greutateReferinta(d.greutateKg, d.inaltimeCm) : d.greutateKg
  return {
    varianta: metoda.apa,
    minMl: metoda.apaMlPeKg[0] * g,
    maxMl: metoda.apaMlPeKg[1] * g,
    greutateFolositaKg: g,
    eticheta: metoda.apa === "B" ? "lichide totale" : "apă",
  }
}

const TABEL_RITM_A: { perioada: string; procentMin: number; procentMax: number }[] = [
  { perioada: "1 săptămână", procentMin: 1, procentMax: 2 },
  { perioada: "1 lună", procentMin: 5, procentMax: 5 },
  { perioada: "3 luni", procentMin: 7.5, procentMax: 7.5 },
  { perioada: "6 luni", procentMin: 10, procentMax: 10 },
  { perioada: "1 an", procentMin: 20, procentMax: 20 },
]

export function calculeazaRitm(
  d: { greutateKg: number; mentinereKcal: number; tintaKcal: number },
  metoda: ConfigMetoda,
): Ritm {
  if (metoda.ritm === "A") {
    return {
      varianta: "A",
      tabel: TABEL_RITM_A.map((r) => ({
        ...r,
        kgMin: (r.procentMin / 100) * d.greutateKg,
        kgMax: (r.procentMax / 100) * d.greutateKg,
      })),
    }
  }
  return {
    varianta: "B",
    kgPeSaptamana: kgPeSaptamanaDinDeficit(d.mentinereKcal, d.tintaKcal, metoda),
    reper6LuniKg: [0.05 * d.greutateKg, 0.1 * d.greutateKg],
  }
}

export function kgPeSaptamanaDinDeficit(mentinereKcal: number, tintaKcal: number, metoda: ConfigMetoda): number {
  return ((mentinereKcal - tintaKcal) * 7) / metoda.kcalPeKgGrasime
}

/**
 * Calculul complet. Opririle de siguranță se verifică primele: dacă există una,
 * rezultatul nu conține nici ținte, nici plan.
 */
export function calculeazaFisa(intrare: IntrareCalcul, config: ConfigEvaluare = CONFIG_IMPLICIT): RezultatCalcul {
  valideazaIntrare(intrare)
  const probleme = valideazaConfig(config)
  if (probleme.length > 0) throw new Error(`Configurare invalidă: ${probleme.join("; ")}`)

  const metoda = config.metoda
  const valoareImc = imc(intrare.greutateKg, intrare.inaltimeCm)

  const opriri = verificaOpriri({
    varstaAni: intrare.varstaAni,
    sarcinaSauAlaptare: intrare.sarcinaSauAlaptare,
    diabetCuInsulina: intrare.diabetCuInsulina,
    imc: valoareImc,
    scoffRaspunsuriDa: intrare.scoffRaspunsuriDa,
    semnalTulburariAlimentare: intrare.semnalTulburariAlimentare,
  })
  if (opriri.length > 0) {
    const minor = opriri.some((o) => o.tip === "minor")
    return {
      stare: "oprit",
      versiuneConfig: config.versiune,
      opriri,
      semnale: minor ? [] : semnaleContext(intrare, valoareImc, config),
    }
  }

  const semnale: Semnal[] = semnaleContext(intrare, valoareImc, config)
  const indicatori = calculeazaIndicatori(intrare, metoda)
  semnale.push(...semnaleTalie(intrare, config))

  const rmb = calculeazaRmb(intrare, indicatori, metoda)

  let activitate: { coef: number; sursa: "confirmat" | "propus" | "implicit"; explicatie: string }
  if (intrare.coefActivitate !== undefined) {
    activitate = { coef: intrare.coefActivitate, sursa: "confirmat", explicatie: "coeficient introdus manual" }
  } else if (intrare.activitate) {
    const p = propuneCoeficient(intrare.activitate, metoda)
    activitate = { coef: p.coef, sursa: "propus", explicatie: p.explicatie }
  } else {
    activitate = {
      coef: metoda.coeficientiActivitate.sedentar,
      sursa: "implicit",
      explicatie: "lipsesc datele despre activitate; s-a folosit coeficientul sedentar",
    }
  }
  if (activitate.sursa !== "confirmat") {
    semnale.push(
      semnal(
        "coeficient_neconfirmat",
        "informativ",
        `Coeficient de activitate ${fmtNumar(activitate.coef, 3)} propus de aplicație (${activitate.explicatie}); de confirmat.`,
      ),
    )
  }

  const mentinereKcal = rmb.valoare * activitate.coef
  const tinta = calculeazaTinta(
    mentinereKcal,
    { sex: intrare.sex, imc: valoareImc, scopSlabire: intrare.scopSlabire },
    metoda,
  )
  if (tinta.pragMinimAtins) {
    semnale.push(
      semnal(
        "prag_minim",
        "atentie",
        `Deficitul de ${fmtKcal(metoda.deficitKcal)} ar coborî aportul sub pragul minim; ținta a rămas la ${fmtKcal(tinta.tintaKcal)}.`,
      ),
    )
  }
  if (intrare.scopSlabire && !tinta.deficitAplicat) {
    semnale.push(
      semnal(
        "imc_sub_25_slabire",
        "atentie",
        `Dorește să slăbească la IMC ${fmtNumar(valoareImc, 1)} (sub ${metoda.imcMinimPentruDeficit}): fără deficit, plan la menținere.`,
      ),
    )
  }

  const macro = calculeazaMacro(
    { greutateKg: intrare.greutateKg, inaltimeCm: intrare.inaltimeCm, tintaKcal: tinta.tintaKcal },
    metoda,
  )
  if (macro === null) {
    semnale.push(
      semnal(
        "macronutrienti_imposibili",
        "atentie",
        `Macronutrienți imposibili: la ținta de ${fmtKcal(tinta.tintaKcal)}, proteinele și grăsimile depășesc caloriile disponibile. Nu se poate genera plan cu această variantă.`,
      ),
    )
  } else {
    if (macro.procente.carbohidrati < config.semnale.carbohidratiMinProcent) {
      semnale.push(
        semnal(
          "carbohidrati_sub_45",
          "informativ",
          `Carbohidrați ${fmtProcent(macro.procente.carbohidrati)} din calorii (sub ${fmtProcent(config.semnale.carbohidratiMinProcent)}).`,
        ),
      )
    }
    if (macro.procente.grasimi > config.semnale.grasimiMaxProcent) {
      semnale.push(
        semnal(
          "grasimi_peste_35",
          "informativ",
          `Grăsimi ${fmtProcent(macro.procente.grasimi)} din calorii (peste ${fmtProcent(config.semnale.grasimiMaxProcent)}).`,
        ),
      )
    }
  }

  const kgPeSapt = kgPeSaptamanaDinDeficit(mentinereKcal, tinta.tintaKcal, metoda)
  if (
    tinta.deficitAplicat &&
    intrare.ritmDoritKgPeSaptamana !== undefined &&
    intrare.ritmDoritKgPeSaptamana > kgPeSapt + 1e-9
  ) {
    semnale.push(
      semnal(
        "ritm_dorit",
        "atentie",
        `Ritm dorit de circa ${fmtNumar(intrare.ritmDoritKgPeSaptamana, 2)} kg pe săptămână; deficitul permite circa ${fmtNumar(kgPeSapt, 2)} kg pe săptămână.`,
      ),
    )
  }

  return {
    stare: "calculat",
    versiuneConfig: config.versiune,
    indicatori,
    rmb,
    activitate,
    mentinereKcal,
    tintaKcal: tinta.tintaKcal,
    deficitAplicat: tinta.deficitAplicat,
    pragMinimAtins: tinta.pragMinimAtins,
    macro,
    planPosibil: macro !== null,
    apa: calculeazaApa(intrare, metoda),
    ritm: tinta.deficitAplicat
      ? calculeazaRitm({ greutateKg: intrare.greutateKg, mentinereKcal, tintaKcal: tinta.tintaKcal }, metoda)
      : null,
    kgPeSaptamanaDinDeficit: kgPeSapt,
    tinteMeseKcal: macro === null ? null : metoda.impartireMese.map((p) => p * tinta.tintaKcal),
    semnale,
  }
}
