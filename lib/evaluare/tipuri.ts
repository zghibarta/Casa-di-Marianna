// Tipurile motorului de calcul. Fără React, fără I/O.

/** F = femeie, B = bărbat (ca în plan.md). */
export type Sex = "F" | "B"

/** Cele 14 circumferințe din fișa Marianei, în cm. Faza 1 folosește doar gât, talie, abdomen, șolduri. */
export interface Masuratori {
  gat?: number
  umeri1?: number
  umeri2?: number
  circumferintaUmeri?: number
  manaStanga?: number
  manaDreapta?: number
  piept?: number
  /** Punctul cel mai îngust al trunchiului. */
  talie?: number
  /** La nivelul ombilicului. */
  abdomen?: number
  solduri?: number
  coapsaStanga?: number
  coapsaDreapta?: number
  gambaStanga?: number
  gambaDreapta?: number
}

export type Intensitate = "usoara" | "moderata" | "intensa"
export type Autoapreciere = "foarte_activ" | "activ" | "mediu" | "usor" | "pasiv"

export interface Antrenament {
  tip: string
  oriPeSaptamana: number
  durataMinute?: number
  intensitate: Intensitate
}

export interface ProfilActivitate {
  autoapreciere?: Autoapreciere
  antrenamente: Antrenament[]
}

/** Informații din interviu care nu intră în formule, dar produc semnale pentru Mariana. */
export interface ContextSemnale {
  boliCronice?: boolean
  tratament?: boolean
  alergii?: boolean
  interventii?: boolean
  suplimente?: boolean
  fumat?: boolean
  alcoolPeSaptamana?: number
  somnOre?: number
  apaLitri?: number
  /** Cea mai mică dintre cele două scale de motivație (1–10). */
  motivatieMinima?: number
}

export interface IntrareCalcul {
  sex: Sex
  varstaAni: number
  inaltimeCm: number
  greutateKg: number
  /** Scopul consultației include slăbirea. */
  scopSlabire: boolean
  /** Coeficient confirmat de Mariana. Dacă lipsește, codul îl propune din `activitate`. */
  coefActivitate?: number
  activitate?: ProfilActivitate
  masuratori?: Masuratori
  /** Ritmul dorit de clientă, în kg pe săptămână. */
  ritmDoritKgPeSaptamana?: number
  // ---- date pentru opririle de siguranță ----
  sarcinaSauAlaptare?: boolean
  diabetCuInsulina?: boolean
  /** Numărul de răspunsuri „da” la SCOFF. */
  scoffRaspunsuriDa?: number
  /** Semnal de tulburare alimentară venit din text liber (Faza 3). */
  semnalTulburariAlimentare?: boolean
  context?: ContextSemnale
}

// ---------- opriri ----------

export type TipOprire = "minor" | "sarcina_alaptare" | "insulina" | "imc_sub_18_5" | "tulburari_alimentare"

export interface Oprire {
  tip: TipOprire
  /** Text pentru fișa Marianei. Mesajul pentru clientă este în interviu/texte.ts. */
  detaliu: string
}

// ---------- semnale ----------

export type CodSemnal =
  | "boala_cronica"
  | "tratament"
  | "alergie"
  | "interventie"
  | "supliment"
  | "fumat"
  | "alcool_frecvent"
  | "somn_scurt"
  | "apa_putina"
  | "motivatie_scazuta"
  | "imc_35"
  | "varsta_65"
  | "prag_minim"
  | "ritm_dorit"
  | "imc_sub_25_slabire"
  | "talie_crescuta"
  | "talie_mult_crescuta"
  | "talie_inaltime"
  | "carbohidrati_sub_45"
  | "grasimi_peste_35"
  | "devine_nedefinita"
  | "macronutrienti_imposibili"
  | "formule_barbati"
  | "coeficient_neconfirmat"

export interface Semnal {
  cod: CodSemnal
  /** „atentie” cere o decizie a Marianei; „informativ” doar o anunță. */
  nivel: "atentie" | "informativ"
  mesaj: string
}

// ---------- rezultat ----------

export type ClasaIMC =
  | "subpondere_severa"
  | "subpondere_moderata"
  | "subpondere_usoara"
  | "normopondere"
  | "suprapondere"
  | "obezitate_1"
  | "obezitate_2"
  | "obezitate_3"

export interface Indicatori {
  imc: number
  clasaImc: ClasaIMC
  /** null sub 152,4 cm, unde formula Devine nu este definită. */
  devineKg: number | null
  intervalSanatosKg: [number, number]
  reper: {
    varianta: "A" | "B"
    /** A: G − Devine (poate fi negativ; null dacă Devine e nedefinită). B: max(0, G − limita de sus). */
    excesKg: number | null
  }
  pgcDeurenberg: number
  pgcNavy: number | null
  /** Doar cu indicatorii de talie activi și talia măsurată. */
  talieInaltime: number | null
}

export interface RezultatRmb {
  varianta: "A" | "B1" | "B2"
  harrisBenedict: number
  mifflinStJeor: number
  katchMcArdle: number
  pgcFolosit: "deurenberg" | "navy"
  valoare: number
}

export interface Macro {
  varianta: "A" | "B"
  greutateReferintaKg: number
  proteineG: number
  grasimiG: number
  carbohidratiG: number
  /** Fracții din ținta calorică (0–1). */
  procente: { proteine: number; grasimi: number; carbohidrati: number }
}

export interface Apa {
  varianta: "A" | "B"
  minMl: number
  maxMl: number
  greutateFolositaKg: number
  eticheta: string
}

export type Ritm =
  | {
      varianta: "A"
      tabel: { perioada: string; procentMin: number; procentMax: number; kgMin: number; kgMax: number }[]
    }
  | {
      varianta: "B"
      kgPeSaptamana: number
      reper6LuniKg: [number, number]
    }

export interface RezultatOprit {
  stare: "oprit"
  versiuneConfig: string
  opriri: Oprire[]
  semnale: Semnal[]
}

export interface RezultatCalculat {
  stare: "calculat"
  versiuneConfig: string
  indicatori: Indicatori
  rmb: RezultatRmb
  activitate: { coef: number; sursa: "confirmat" | "propus" | "implicit"; explicatie: string }
  mentinereKcal: number
  tintaKcal: number
  deficitAplicat: boolean
  pragMinimAtins: boolean
  /** null = carbohidrați negativi: nu se poate face plan. */
  macro: Macro | null
  planPosibil: boolean
  apa: Apa
  /** null când nu se aplică deficit. */
  ritm: Ritm | null
  /** Ritmul pe care îl permite deficitul real, indiferent de varianta de afișare. */
  kgPeSaptamanaDinDeficit: number
  /** kcal pe mic dejun, gustare, prânz, gustare, cină; null fără plan. */
  tinteMeseKcal: number[] | null
  semnale: Semnal[]
}

export type RezultatCalcul = RezultatOprit | RezultatCalculat
