// Toate deciziile metodei și ale interviului, într-un singur loc.
//
// Mariana nu a răspuns încă la cele 18 întrebări din docs/evaluare/plan.md §1.
// Alegerile de mai jos sunt făcute provizoriu (vezi docs/evaluare/DECIZII.md) și
// trebuie validate de ea înainte de lansare. Fiecare alternativă rămâne implementată:
// se schimbă valoarea aici, nu codul.
//
// Protecțiile din PROTECTII (vârstă minimă, IMC minim, carbohidrați negativi, prag caloric)
// NU fac parte din variante și se aplică indiferent de alegeri.

export const VERSIUNE_CONFIG = "faza1-2026-11-16"

/** Opriri de siguranță. Nu depind de varianta de calcul și nu se dezactivează. */
export const PROTECTII = {
  varstaMinimaAni: 18,
  /** Sub acest IMC interviul se oprește și nu se calculează ținte. */
  imcMinim: 18.5,
  /** Numărul de „da” la SCOFF de la care interviul se oprește (Morgan și colab., BMJ 1999). */
  scoffPragOprire: 2,
} as const

export interface ConfigMetoda {
  /** A: formula Devine. B: interval IMC 18,5–24,9. */
  reperGreutate: "A" | "B"
  /** A: media HB, MSJ, Katch (PGC Deurenberg). B1: la fel, dar Katch cu PGC Navy când există măsurători. B2: doar Mifflin-St Jeor. */
  rmb: "A" | "B1" | "B2"
  coeficientiActivitate: {
    sedentar: number
    /** 1–3 antrenamente pe săptămână. */
    usor: number
    /** 4–5 antrenamente pe săptămână. */
    moderat: number
    /** Zilnic sau 3–4 intense. */
    activ: number
    /** 6–7 intense. A: 1,75. B: 1,725. */
    foarteActiv: number
    /** 2 pe zi sau muncă fizică grea. */
    extrem: number
  }
  deficitKcal: number
  /** Deficitul se aplică doar de la acest IMC în sus. */
  imcMinimPentruDeficit: number
  pragMinimKcal: { F: number; B: number }
  /** A: grame pe kg corp. B: grăsimi ca procent din calorii, proteine pe greutatea de referință la IMC ≥ 30. */
  macro: "A" | "B"
  proteineGPeKg: number
  /** Doar varianta A. */
  grasimiGPeKg: number
  /** Doar varianta B. Reglabil între 0,25 și 0,35. */
  procentGrasimi: number
  /** A: pe greutatea actuală. B: „lichide totale”, pe greutatea de referință la IMC ≥ 30. */
  apa: "A" | "B"
  apaMlPeKg: [number, number]
  /** A: tabelul procentual din studiu. B: calculat din deficitul real. */
  ritm: "A" | "B"
  kcalPeKgGrasime: number
  /** Raport talie/înălțime și praguri OMS pentru talie; se calculează doar cu măsurători. */
  indicatoriTalie: boolean
  /** Mic dejun, gustare, prânz, gustare, cină. Suma = 1. */
  impartireMese: [number, number, number, number, number]
}

export interface ConfigSemnale {
  /** De câte ori pe săptămână înseamnă „alcool frecvent”. */
  alcoolFrecventPeSaptamana: number
  somnMinimOre: number
  apaMinimaLitri: number
  motivatieScazutaMax: number
  imcAtentie: number
  varstaAtentie: number
  talieCm: { F: [number, number]; B: [number, number] }
  talieInaltimePrag: number
  carbohidratiMinProcent: number
  grasimiMaxProcent: number
}

export interface ConfigInterviu {
  /** „tu” nu are încă formulări scrise; textele sunt în interviu/texte.ts. */
  adresare: "dumneavoastra" | "tu"
  scoffActiv: boolean
  grupaSanguinaActiva: boolean
  /** Bifa de acord pentru prelucrarea cu AI. Oprită în Faza 1, unde nu există AI. */
  consimtamantAI: boolean
  /** Când e false, mesajele nu promit că Mariana a primit ceva. */
  trimitereActiva: boolean
  versiuneConsimtamant: string
}

export interface ConfigEvaluare {
  versiune: string
  metoda: ConfigMetoda
  semnale: ConfigSemnale
  interviu: ConfigInterviu
}

/** Numărul de ori pe săptămână pentru fiecare etichetă de frecvență (întrebarea 4). */
export const FRECVENTE = {
  zilnic: 7,
  foarte_des: 5.5,
  des: 3.5,
  unu_doua: 1.5,
  rar: 0.5,
  niciodata: 0,
} as const
export type IdFrecventa = keyof typeof FRECVENTE

// ---------- Varianta A: metoda din studiul de caz al Marianei ----------

const METODA_A: ConfigMetoda = {
  reperGreutate: "A",
  rmb: "A",
  coeficientiActivitate: { sedentar: 1.2, usor: 1.375, moderat: 1.465, activ: 1.55, foarteActiv: 1.75, extrem: 1.9 },
  deficitKcal: 500,
  imcMinimPentruDeficit: 25,
  pragMinimKcal: { F: 1200, B: 1800 },
  macro: "A",
  proteineGPeKg: 1.2,
  grasimiGPeKg: 0.9,
  procentGrasimi: 0.3,
  apa: "A",
  apaMlPeKg: [30, 40],
  ritm: "A",
  kcalPeKgGrasime: 7700,
  indicatoriTalie: false,
  impartireMese: [0.25, 0.1, 0.35, 0.1, 0.2],
}

// ---------- Varianta B: toate propunerile din plan.md §2 ----------

const METODA_B: ConfigMetoda = {
  ...METODA_A,
  reperGreutate: "B",
  rmb: "B1",
  coeficientiActivitate: { ...METODA_A.coeficientiActivitate, foarteActiv: 1.725 },
  macro: "B",
  apa: "B",
  ritm: "B",
  indicatoriTalie: true,
}

// ---------- Alegerile implicite (de validat de Mariana) ----------

const METODA_IMPLICITA: ConfigMetoda = {
  // Praguri și constante neschimbate față de studiu: deficit 500 kcal, prag 1200 F / 1800 B
  // (1800 e varianta prudentă la bărbați), 7700 kcal/kg, mese 25/10/35/10/20.
  ...METODA_A,

  // B. Devine e o formulă de dozare a medicamentelor, nu un reper de greutate. Intervalul de
  // IMC arată clientei din studiu 12,5 kg peste limită în loc de 23,2 kg „exces”: mai corect
  // și mai puțin descurajant. Devine se calculează în continuare și apare în fișă.
  reperGreutate: "B",

  // B1. Fără măsurători este identică cu A, deci păstrează metoda Marianei; cu măsurători
  // folosește circumferințele reale. Diferența față de B2 (doar Mifflin) este sub 20 kcal.
  rmb: "B1",

  // B. 1,725 este valoarea uzuală din literatură pentru 6–7 antrenamente intense, nu 1,75.
  // Nu afectează studiul de caz.
  coeficientiActivitate: { ...METODA_A.coeficientiActivitate, foarteActiv: 1.725 },

  // B. Varianta A dă 41% grăsimi (peste 20–35% EFSA) și carbohidrați negativi la greutăți
  // mari. 30% din calorii e în interval; proteinele pe greutatea de referință evită cifre
  // umflate la IMC ≥ 30.
  macro: "B",
  procentGrasimi: 0.3,

  // B. Aceeași formulă, dar pe greutatea de referință la IMC ≥ 30 și numită „lichide totale”,
  // ca să nu ceară peste 4 l de apă la greutăți mari.
  apa: "B",

  // B. 1–2% pe săptămână ar cere un deficit de 900–1900 kcal/zi; cu 500 kcal ritmul real e
  // de circa 0,45 kg pe săptămână. Un ritm promis și neatins culpabilizează clienta.
  ritm: "B",

  // Activ. Raportul talie/înălțime și pragurile OMS sunt indicatori de risc mai buni decât
  // IMC singur; apar doar după ce Mariana introduce măsurătorile.
  indicatoriTalie: true,
}

const SEMNALE_IMPLICITE: ConfigSemnale = {
  // Pragurile nedefinite în plan, alese aici: alcool de 3 ori pe săptămână sau mai des
  // („des” în sus) și somn sub 6 ore, calculat din ora de culcare și de trezire.
  alcoolFrecventPeSaptamana: 3,
  somnMinimOre: 6,
  apaMinimaLitri: 1,
  motivatieScazutaMax: 4,
  imcAtentie: 35,
  varstaAtentie: 65,
  talieCm: { F: [80, 88], B: [94, 102] },
  talieInaltimePrag: 0.5,
  carbohidratiMinProcent: 0.45,
  grasimiMaxProcent: 0.35,
}

const INTERVIU_IMPLICIT: ConfigInterviu = {
  // „Dumneavoastră”, ca în chestionarul pe hârtie. Forma „tu” nu este scrisă încă, ca
  // Mariana să nu valideze două seturi de formulări (abatere acceptată de Aurel).
  adresare: "dumneavoastra",
  // SCOFF activ: fără el nu avem nicio întrebare despre tulburările alimentare.
  scoffActiv: true,
  // Grupa sanguină nu intră în niciun calcul și dietele pe grupe nu au dovezi.
  grupaSanguinaActiva: false,
  // Faza 1 nu folosește AI și nu trimite date: nu cerem acord pentru ce nu se întâmplă.
  consimtamantAI: false,
  trimitereActiva: false,
  versiuneConsimtamant: "faza1-v1",
}

export const VARIANTA_A: ConfigEvaluare = {
  versiune: `${VERSIUNE_CONFIG}/A`,
  metoda: METODA_A,
  semnale: SEMNALE_IMPLICITE,
  interviu: INTERVIU_IMPLICIT,
}

export const VARIANTA_B: ConfigEvaluare = {
  versiune: `${VERSIUNE_CONFIG}/B`,
  metoda: METODA_B,
  semnale: SEMNALE_IMPLICITE,
  interviu: INTERVIU_IMPLICIT,
}

export const CONFIG_IMPLICIT: ConfigEvaluare = {
  versiune: `${VERSIUNE_CONFIG}/implicit`,
  metoda: METODA_IMPLICITA,
  semnale: SEMNALE_IMPLICITE,
  interviu: INTERVIU_IMPLICIT,
}

/** Întoarce lista problemelor din configurare; goală dacă e validă. */
export function valideazaConfig(config: ConfigEvaluare): string[] {
  const m = config.metoda
  const probleme: string[] = []
  if (m.procentGrasimi < 0.25 || m.procentGrasimi > 0.35) {
    probleme.push("procentGrasimi trebuie să fie între 0,25 și 0,35")
  }
  const sumaMese = m.impartireMese.reduce((a, b) => a + b, 0)
  if (Math.abs(sumaMese - 1) > 1e-9) probleme.push("impartireMese trebuie să însumeze 1")
  if (m.deficitKcal < 0) probleme.push("deficitKcal nu poate fi negativ")
  if (m.apaMlPeKg[0] > m.apaMlPeKg[1]) probleme.push("apaMlPeKg trebuie să fie [minim, maxim]")
  return probleme
}
