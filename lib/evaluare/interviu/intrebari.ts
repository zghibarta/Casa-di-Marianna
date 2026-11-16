// Graful de întrebări. Ordinea și ramificațiile sunt date, nu logică de UI: fiecare pas este un
// ecran. Formulările sunt în texte.ts.
//
// Există două variante, alese din config (`interviu.varianta`):
//   PASI_SCURT   – 9 ecrane după consimțământ (10 în total), doar ce trebuie pentru evaluarea
//                  inițială și pentru opririle de siguranță;
//   PASI_COMPLET – chestionarul întreg din plan.md §3 și §7 (o întrebare-poartă pe ecran, cu
//                  detaliile ei condiționale).

import type { ConfigEvaluare } from "../config"
import { esteDa, lista, text, type Raspunsuri } from "./raspunsuri"
import type { IdBloc, IdOptiuni } from "./texte"

export type TipCamp =
  | "text"
  | "text_lung"
  | "numar"
  | "data"
  | "ora"
  | "da_nu"
  | "alegere"
  | "alegere_multipla"
  | "scala"
  | "frecventa"
  | "antrenamente"

export interface Camp {
  id: string
  tip: TipCamp
  obligatoriu: boolean
  /** Setul de opțiuni din texte.ts, pentru alegere, alegere_multipla și frecventa. */
  optiuni?: IdOptiuni
  min?: number
  max?: number
  unitate?: string
  /** La alegere_multipla: opțiunea care nu se poate combina cu altele („niciuna”). */
  exclusiv?: string
  /** „contact”: trebuie să arate a număr de telefon sau a adresă de email. */
  format?: "contact"
  /** Câmpul apare doar când condiția e adevărată. Fără condiție, apare mereu. */
  vizibil?: (r: Raspunsuri, config: ConfigEvaluare) => boolean
}

export interface Pas {
  id: string
  bloc: IdBloc
  campuri: Camp[]
}

type Conditie = NonNullable<Camp["vizibil"]>
const da =
  (id: string): Conditie =>
  (r) =>
    esteDa(r, id)

const o = (id: string, tip: TipCamp, extra: Partial<Camp> = {}): Camp => ({ id, tip, obligatoriu: true, ...extra })
const c = (id: string, tip: TipCamp, vizibil: Conditie, extra: Partial<Camp> = {}): Camp => ({
  id,
  tip,
  obligatoriu: true,
  vizibil,
  ...extra,
})
const optional = (id: string, tip: TipCamp, extra: Partial<Camp> = {}): Camp => ({
  id,
  tip,
  obligatoriu: false,
  ...extra,
})

/** Întrebare-poartă da/nu, cu un câmp de detalii care apare la „da”. */
const poarta = (bloc: IdBloc, id: string): Pas => ({
  id,
  bloc,
  campuri: [o(id, "da_nu"), c(`${id}_detalii`, "text_lung", da(id))],
})

/** Grupă de alimente: „consumați?”, apoi frecvența și detaliile doar la „da”. */
const grupa = (id: string, extra: Camp[] = []): Pas => ({
  id,
  bloc: "alimente",
  campuri: [
    o(id, "da_nu"),
    c(`${id}_frecventa`, "frecventa", da(id), { optiuni: "frecventa" }),
    c(`${id}_detalii`, "text_lung", da(id)),
    ...extra,
  ],
})

export const SCOFF_IDS = ["scoff_1", "scoff_2", "scoff_3", "scoff_4", "scoff_5"] as const

/** Lungimea maximă a răspunsurilor scrise, în caractere (verificată și pe server). */
export const LIMITE_TEXT = { text: 200, text_lung: 1500 } as const

const PAS_CORP: Pas = {
  id: "corp",
  bloc: "baza",
  campuri: [
    o("inaltime", "numar", { min: 120, max: 230, unitate: "cm" }),
    o("greutate", "numar", { min: 30, max: 300, unitate: "kg" }),
  ],
}

// Relația cu mâncarea (SCOFF): rămâne în ambele variante, pentru siguranță.
const PAS_SCOFF: Pas = {
  id: "scoff",
  bloc: "relatie",
  campuri: SCOFF_IDS.map((id) => c(id, "da_nu", (_r, config) => config.interviu.scoffActiv)),
}

// ---------- Varianta scurtă: ecranele 2–10 (ecranul 1 este consimțământul) ----------

export const PASI_SCURT: Pas[] = [
  // 2. Vârsta în ani, nu data nașterii: e suficientă pentru formule și mai puțin personală.
  {
    id: "despre",
    bloc: "baza",
    campuri: [
      o("varsta", "numar", { min: 1, max: 120, unitate: "ani" }),
      o("sex", "alegere", { optiuni: "sex" }),
      c("sarcina_alaptare", "da_nu", (r) => text(r, "sex") === "F"),
    ],
  },
  // 3.
  PAS_CORP,
  // 4.
  {
    id: "scop",
    bloc: "scop",
    campuri: [
      o("scopuri", "alegere_multipla", { optiuni: "scopuri" }),
      { ...optional("scop_altul", "text"), vizibil: (r) => lista(r, "scopuri").includes("altul") },
      {
        ...optional("scop_slabire_kg", "numar", { min: 1, max: 150, unitate: "kg" }),
        vizibil: (r) => lista(r, "scopuri").includes("slabire"),
      },
    ],
  },
  // 5. Listă de bifat, fără text liber. Insulina se întreabă doar la diabet.
  {
    id: "sanatate",
    bloc: "sanatate",
    campuri: [
      o("afectiuni", "alegere_multipla", { optiuni: "afectiuni", exclusiv: "niciuna" }),
      c("insulina", "da_nu", (r) => lista(r, "afectiuni").includes("diabet")),
      o("tratament_permanent", "da_nu"),
    ],
  },
  // 6. Alergiile sunt întrebare da/nu (obligatorie, pentru siguranță); detaliile, un singur
  // câmp scurt și opțional.
  {
    id: "alergii",
    bloc: "alimentatie",
    campuri: [o("alergii_alimentare", "da_nu"), optional("alimente_evitate", "text")],
  },
  // 7. Doar autoaprecierea; coeficientul se propune din ea (config: coeficientDinAutoapreciere).
  {
    id: "activitate",
    bloc: "activitate",
    campuri: [o("activitate_auto", "alegere", { optiuni: "autoapreciere_scurt" })],
  },
  // 8.
  {
    id: "mese",
    bloc: "obiceiuri",
    campuri: [
      o("mese_pe_zi", "numar", { min: 0, max: 10, unitate: "mese" }),
      o("omite_mese", "da_nu"),
      o("mananca_noaptea", "da_nu"),
    ],
  },
  // 9.
  PAS_SCOFF,
  // 10. Butonul acestui ecran este „Trimite”.
  {
    id: "contact",
    bloc: "contact",
    campuri: [o("nume", "text"), o("contact", "text", { format: "contact" }), optional("mesaj", "text_lung")],
  },
]

// ---------- Varianta completă: chestionarul întreg (dezactivat implicit din config) ----------

export const PASI_COMPLET: Pas[] = [
  // ---- 1. Bază și siguranță ----
  { id: "data_nasterii", bloc: "baza", campuri: [o("data_nasterii", "data")] },
  {
    id: "sex",
    bloc: "baza",
    campuri: [
      o("sex", "alegere", { optiuni: "sex" }),
      c("sarcina_alaptare", "da_nu", (r) => text(r, "sex") === "F"),
    ],
  },
  PAS_CORP,

  // ---- 2. Date generale ----
  { id: "nume", bloc: "general", campuri: [o("nume", "text"), o("contact", "text", { format: "contact" })] },
  {
    id: "ocupatie",
    bloc: "general",
    campuri: [
      o("ocupatie", "text"),
      optional("greutate_maxima", "numar", { min: 30, max: 300, unitate: "kg" }),
      optional("greutate_minima", "numar", { min: 30, max: 300, unitate: "kg" }),
      {
        ...optional("grupa_sanguina", "text"),
        vizibil: (_r, config) => config.interviu.grupaSanguinaActiva,
      },
    ],
  },

  // ---- 3. Scop ----
  {
    id: "scop",
    bloc: "scop",
    campuri: [
      o("scopuri", "alegere_multipla", { optiuni: "scopuri" }),
      c("scop_altul", "text", (r) => lista(r, "scopuri").includes("altul")),
      {
        ...optional("scop_slabire_kg", "numar", { min: 1, max: 150, unitate: "kg" }),
        vizibil: (r) => lista(r, "scopuri").includes("slabire"),
      },
      {
        ...optional("scop_slabire_luni", "numar", { min: 1, max: 60, unitate: "luni" }),
        vizibil: (r) => lista(r, "scopuri").includes("slabire"),
      },
    ],
  },

  // ---- 4. Sănătate ----
  poarta("sanatate", "interventii"),
  poarta("sanatate", "traume"),
  poarta("sanatate", "alergii"),
  poarta("sanatate", "antecedente"),
  {
    id: "boli_cronice",
    bloc: "sanatate",
    campuri: [
      o("boli_cronice", "da_nu"),
      c("boli_sisteme", "alegere_multipla", da("boli_cronice"), { optiuni: "sisteme" }),
      c("boli_detalii", "text_lung", da("boli_cronice")),
      // Întrebarea despre diabet apare la orice boală cronică, nu doar la „endocrin”,
      // ca oprirea pentru insulină să nu depindă de cum și-a încadrat clienta boala.
      c("diabet", "da_nu", da("boli_cronice")),
      c("insulina", "da_nu", (r) => esteDa(r, "boli_cronice") && esteDa(r, "diabet")),
    ],
  },
  poarta("sanatate", "tratament"),
  poarta("sanatate", "suplimente"),
  { id: "fumat", bloc: "sanatate", campuri: [o("fumat", "da_nu"), optional("sanatate_altele", "text_lung")] },

  // ---- 5. Motivație ----
  {
    id: "motivatie",
    bloc: "motivatie",
    campuri: [
      o("motivatie_schimbare", "scala", { min: 1, max: 10 }),
      o("motivatie_recomandari", "scala", { min: 1, max: 10 }),
    ],
  },

  // ---- 6. Regimul zilei ----
  {
    id: "somn",
    bloc: "zi",
    campuri: [
      o("ora_trezire", "ora"),
      o("ora_culcare", "ora"),
      o("somn", "alegere", { optiuni: "somn" }),
      optional("somn_detalii", "text"),
    ],
  },

  // ---- 7. Activitate fizică ----
  {
    id: "activitate",
    bloc: "activitate",
    campuri: [
      o("activitate_auto", "alegere", { optiuni: "autoapreciere" }),
      {
        ...optional("antrenamente", "antrenamente"),
        vizibil: (r) => text(r, "activitate_auto") !== "" && text(r, "activitate_auto") !== "pasiv",
      },
    ],
  },

  // ---- 8. Lichide și alcool ----
  {
    id: "apa",
    bloc: "lichide",
    campuri: [o("apa_litri", "numar", { min: 0, max: 8, unitate: "litri" }), o("apa_cum", "alegere", { optiuni: "apa_cum" })],
  },
  { id: "alte_bauturi", bloc: "lichide", campuri: [o("alte_bauturi", "text")] },
  {
    id: "alcool",
    bloc: "lichide",
    campuri: [
      o("alcool_frecventa", "frecventa", { optiuni: "frecventa_cu_niciodata" }),
      c("alcool_detalii", "text", (r) => text(r, "alcool_frecventa") !== "" && text(r, "alcool_frecventa") !== "niciodata"),
    ],
  },

  // ---- 9. Obiceiuri de masă ----
  {
    id: "mese",
    bloc: "obiceiuri",
    campuri: [
      o("mananca_zilnic", "da_nu"),
      o("mese_pe_zi", "numar", { min: 0, max: 10, unitate: "mese" }),
      o("ora_fixa", "alegere", { optiuni: "ora_fixa" }),
    ],
  },
  poarta("obiceiuri", "gustari"),
  {
    id: "mananca_noaptea",
    bloc: "obiceiuri",
    campuri: [o("mananca_noaptea", "da_nu"), c("noapte_frecventa", "frecventa", da("mananca_noaptea"), { optiuni: "frecventa" })],
  },
  {
    id: "ritm_mese",
    bloc: "obiceiuri",
    campuri: [o("prima_masa", "alegere", { optiuni: "prima_masa" }), o("ultima_masa", "alegere", { optiuni: "ultima_masa" })],
  },
  {
    id: "consistenta",
    bloc: "obiceiuri",
    campuri: [
      o("masa_consistenta", "alegere", { optiuni: "masa_consistenta" }),
      o("omite_mese", "da_nu"),
      c("mese_omise", "alegere_multipla", da("omite_mese"), { optiuni: "mese_principale" }),
    ],
  },

  // ---- 10. Grupe de alimente ----
  grupa("carne"),
  grupa("lactate"),
  grupa("cereale"),
  grupa("boboase"),
  grupa("nuci"),
  // „Ce legume nu consumați” se întreabă mereu, indiferent de răspunsul la poartă.
  grupa("legume", [o("legume_nu", "text")]),
  grupa("fructe", [c("fructe_uscate", "da_nu", da("fructe")), c("fructe_uscate_detalii", "text", (r) => esteDa(r, "fructe") && esteDa(r, "fructe_uscate"))]),
  grupa("peste"),
  grupa("oua"),
  grupa("fastfood"),
  grupa("dulciuri"),

  // ---- 11. Relația cu mâncarea (SCOFF) ----
  PAS_SCOFF,

  // ---- 12. Încheiere ----
  {
    id: "mirodenii",
    bloc: "incheiere",
    campuri: [o("mirodenii", "da_nu"), c("mirodenii_detalii", "text", da("mirodenii")), optional("informatii", "text_lung")],
  },
]

/** Pașii variantei de interviu aleasă în config. */
export function pasiInterviu(config: ConfigEvaluare): Pas[] {
  return config.interviu.varianta === "complet" ? PASI_COMPLET : PASI_SCURT
}
