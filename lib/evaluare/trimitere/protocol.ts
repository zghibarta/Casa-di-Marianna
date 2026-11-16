// Ce schimbă browserul cu ruta de trimitere (app/api/evaluare). Doar tipuri și constante.

import type { Raspunsuri } from "../interviu/raspunsuri"
import type { TipOprire } from "../tipuri"

export const RUTA_TRIMITERE = "/api/evaluare"

/** Câmpul-capcană: oamenii nu îl văd; un robot care îl completează este ignorat. */
export const CAMP_CAPCANA = "website"

/** Fișa completă: pleacă doar cu acord și doar dacă nu există nicio oprire de siguranță. */
export interface CerereEvaluare {
  tip: "evaluare"
  consimtamant: boolean
  raspunsuri: Raspunsuri
  website: string
}

/** După o oprire de siguranță: doar numele și contactul, fără niciun răspuns medical. */
export interface CerereContact {
  tip: "contact"
  consimtamant: boolean
  nume: string
  contact: string
  website: string
}

export type Cerere = CerereEvaluare | CerereContact

export type CodRefuz =
  | "cerere_invalida"
  | "cerere_prea_mare"
  | "fara_consimtamant"
  | "raspunsuri_invalide"
  | "contact_invalid"
  | "oprire"
  | "trimitere_inactiva"
  | "prea_multe_cereri"
  | "trimitere_neconfigurata"
  | "trimitere_esuata"

export type RaspunsServer = { ok: true } | { ok: false; cod: CodRefuz; oprire?: TipOprire }
