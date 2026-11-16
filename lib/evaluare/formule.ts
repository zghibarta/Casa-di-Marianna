// Formulele din docs/evaluare/plan.md §4. Funcții pure, precizie completă (fără rotunjiri).

import type { ClasaIMC, Masuratori, Sex } from "./tipuri"

export const INALTIME_MINIMA_DEVINE_CM = 152.4
export const IMC_SANATOS: [number, number] = [18.5, 24.9]

export function imc(greutateKg: number, inaltimeCm: number): number {
  const h = inaltimeCm / 100
  return greutateKg / (h * h)
}

export function clasaIMC(valoare: number): ClasaIMC {
  if (valoare < 16) return "subpondere_severa"
  if (valoare < 17) return "subpondere_moderata"
  if (valoare < 18.5) return "subpondere_usoara"
  if (valoare < 25) return "normopondere"
  if (valoare < 30) return "suprapondere"
  if (valoare < 35) return "obezitate_1"
  if (valoare < 40) return "obezitate_2"
  return "obezitate_3"
}

/** Devine (1974), cu 0,9 kg/cm ca în studiu. null sub 152,4 cm, unde formula nu e definită. */
export function greutateDevine(sex: Sex, inaltimeCm: number): number | null {
  if (inaltimeCm < INALTIME_MINIMA_DEVINE_CM) return null
  return (sex === "F" ? 45.5 : 50.0) + 0.9 * (inaltimeCm - INALTIME_MINIMA_DEVINE_CM)
}

/** Intervalul de greutate pentru IMC 18,5–24,9. */
export function intervalGreutateSanatoasa(inaltimeCm: number): [number, number] {
  const h2 = (inaltimeCm / 100) ** 2
  return [IMC_SANATOS[0] * h2, IMC_SANATOS[1] * h2]
}

/** Greutatea la IMC 25, folosită ca referință la IMC ≥ 30 (varianta B). */
export function greutateReferinta(greutateKg: number, inaltimeCm: number): number {
  const h2 = (inaltimeCm / 100) ** 2
  return imc(greutateKg, inaltimeCm) >= 30 ? 25 * h2 : greutateKg
}

/** Deurenberg și colab., Br J Nutr 1991. */
export function pgcDeurenberg(valoareImc: number, varstaAni: number, sex: Sex): number {
  return 1.2 * valoareImc + 0.23 * varstaAni - 10.8 * (sex === "B" ? 1 : 0) - 5.4
}

/** US Navy (Hodgdon și Beckett, 1984), în cm. null dacă lipsesc măsurătorile necesare. */
export function pgcNavy(sex: Sex, inaltimeCm: number, m: Masuratori | undefined): number | null {
  if (!m || m.gat === undefined) return null
  if (sex === "F") {
    if (m.talie === undefined || m.solduri === undefined) return null
    const circ = m.talie + m.solduri - m.gat
    if (circ <= 0) return null
    return 495 / (1.29579 - 0.35004 * Math.log10(circ) + 0.221 * Math.log10(inaltimeCm)) - 450
  }
  if (m.abdomen === undefined) return null
  const circ = m.abdomen - m.gat
  if (circ <= 0) return null
  return 495 / (1.0324 - 0.19077 * Math.log10(circ) + 0.15456 * Math.log10(inaltimeCm)) - 450
}

/** Harris-Benedict revizuită (Roza și Shizgal, AJCN 1984). */
export function harrisBenedict(sex: Sex, greutateKg: number, inaltimeCm: number, varstaAni: number): number {
  return sex === "F"
    ? 447.593 + 9.247 * greutateKg + 3.098 * inaltimeCm - 4.33 * varstaAni
    : 88.362 + 13.397 * greutateKg + 4.799 * inaltimeCm - 5.677 * varstaAni
}

/** Mifflin și colab., AJCN 1990. */
export function mifflinStJeor(sex: Sex, greutateKg: number, inaltimeCm: number, varstaAni: number): number {
  return 10 * greutateKg + 6.25 * inaltimeCm - 5 * varstaAni + (sex === "F" ? -161 : 5)
}

/** Katch-McArdle, cu procentul de grăsime corporală. */
export function katchMcArdle(greutateKg: number, pgc: number): number {
  return 370 + 21.6 * greutateKg * (1 - pgc / 100)
}

/** Vârsta în ani împliniți. `dataNasterii` în format AAAA-LL-ZZ; null dacă nu e o dată validă. */
export function varstaInAni(dataNasterii: string, azi: Date): number | null {
  const p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataNasterii)
  if (!p) return null
  const an = Number(p[1])
  const luna = Number(p[2])
  const zi = Number(p[3])
  const d = new Date(an, luna - 1, zi)
  if (d.getFullYear() !== an || d.getMonth() !== luna - 1 || d.getDate() !== zi) return null
  let varsta = azi.getFullYear() - an
  const inainteDeZi = azi.getMonth() + 1 < luna || (azi.getMonth() + 1 === luna && azi.getDate() < zi)
  if (inainteDeZi) varsta -= 1
  return varsta
}
