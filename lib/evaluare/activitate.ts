// Propunerea coeficientului de activitate din orarul antrenamentelor.
// Codul doar propune; Mariana confirmă sau schimbă în fișă.

import type { ConfigMetoda } from "./config"
import type { Autoapreciere, ProfilActivitate } from "./tipuri"

const NIVEL_AUTOAPRECIERE: Record<Autoapreciere, string> = {
  pasiv: "aproape deloc",
  usor: "mișcare ușoară",
  mediu: "mișcare moderată",
  activ: "multă mișcare",
  foarte_activ: "foarte multă mișcare",
}

export interface PropunereCoeficient {
  coef: number
  /** true când propunerea vine doar din autoapreciere, fără orarul antrenamentelor. */
  dinAutoapreciere: boolean
  antrenamentePeSaptamana: number
  intensePeSaptamana: number
  explicatie: string
}

/**
 * Tabelul din plan.md are goluri (de ex. 4–5 antrenamente intense). Regula confirmată de Aurel:
 * coef = max(după totalul antrenamentelor, după cele intense).
 *   total:   0 → sedentar | 1–3 → ușor | 4–5 → moderat | 6–7 → activ | peste 7 → extrem
 *   intense: 3–5 → activ | 6–7 → foarte activ
 * „Muncă fizică grea → 1,9” nu se propune automat: nu există o întrebare structurată,
 * așa că Mariana o decide din ocupație.
 *
 * În interviul scurt nu există orar (`doarAutoapreciere`): nivelul vine din autoapreciere, după
 * `coeficientDinAutoapreciere` din config.
 */
export function propuneCoeficient(profil: ProfilActivitate | undefined, metoda: ConfigMetoda): PropunereCoeficient {
  const c = metoda.coeficientiActivitate
  if (profil?.doarAutoapreciere && profil.autoapreciere) {
    return {
      coef: c[metoda.coeficientDinAutoapreciere[profil.autoapreciere]],
      dinAutoapreciere: true,
      antrenamentePeSaptamana: 0,
      intensePeSaptamana: 0,
      explicatie: `din autoapreciere („${NIVEL_AUTOAPRECIERE[profil.autoapreciere]}”), fără orarul antrenamentelor`,
    }
  }
  const antrenamente = profil?.autoapreciere === "pasiv" ? [] : (profil?.antrenamente ?? [])
  const total = antrenamente.reduce((s, a) => s + Math.max(0, a.oriPeSaptamana), 0)
  const intense = antrenamente
    .filter((a) => a.intensitate === "intensa")
    .reduce((s, a) => s + Math.max(0, a.oriPeSaptamana), 0)

  let dupaTotal = c.sedentar
  if (total > 7) dupaTotal = c.extrem
  else if (total >= 6) dupaTotal = c.activ
  else if (total >= 4) dupaTotal = c.moderat
  else if (total >= 1) dupaTotal = c.usor

  let dupaIntense = c.sedentar
  if (intense >= 6) dupaIntense = c.foarteActiv
  else if (intense >= 3) dupaIntense = c.activ

  const coef = Math.max(dupaTotal, dupaIntense)
  const explicatie =
    total === 0
      ? "fără antrenamente regulate"
      : `antrenamente pe săptămână: ${total}, din care intense: ${intense}`
  return { coef, dinAutoapreciere: false, antrenamentePeSaptamana: total, intensePeSaptamana: intense, explicatie }
}
