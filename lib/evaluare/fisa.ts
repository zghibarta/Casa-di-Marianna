// Rândurile de cifre ale fișei pentru Mariana, ca text. Aici se aplică rotunjirea de afișare.
// Folosit de ecranul de debug; în Faza 2 îl va folosi panoul Marianei.

import { fmtGrame, fmtIMC, fmtKcal, fmtKg, fmtMl, fmtNumar, fmtProcent } from "./afisare"
import type { ClasaIMC, RezultatCalculat } from "./tipuri"

export const ETICHETE_CLASA_IMC: Record<ClasaIMC, string> = {
  subpondere_severa: "subpondere severă",
  subpondere_moderata: "subpondere moderată",
  subpondere_usoara: "subpondere ușoară",
  normopondere: "normopondere",
  suprapondere: "suprapondere",
  obezitate_1: "obezitate gradul I",
  obezitate_2: "obezitate gradul II",
  obezitate_3: "obezitate gradul III",
}

export interface RandCalcul {
  eticheta: string
  valoare: string
}

/**
 * @param precizieCompleta afișează trei zecimale în loc de rotunjirea obișnuită, pentru
 *   verificarea motorului față de plan.md.
 */
export function randuriCalcul(rez: RezultatCalculat, precizieCompleta = false): RandCalcul[] {
  const p = precizieCompleta
  const kcal = (v: number) => (p ? `${fmtNumar(v, 3)} kcal` : fmtKcal(v))
  const g = (v: number) => (p ? `${fmtNumar(v, 3)} g` : fmtGrame(v))
  const kg = (v: number) => (p ? `${fmtNumar(v, 3)} kg` : fmtKg(v))
  const proc = (v: number) => (p ? `${fmtNumar(v, 3)}%` : `${fmtNumar(v, 1)}%`)
  const i = rez.indicatori

  const randuri: RandCalcul[] = [
    { eticheta: "IMC", valoare: `${p ? fmtNumar(i.imc, 3) : fmtIMC(i.imc)} (${ETICHETE_CLASA_IMC[i.clasaImc]})` },
    {
      eticheta: `Reper de greutate (${i.reper.varianta})`,
      valoare:
        i.reper.varianta === "A"
          ? i.devineKg === null
            ? "Devine nedefinită la această înălțime"
            : `Devine ${kg(i.devineKg)}`
          : `interval ${kg(i.intervalSanatosKg[0])} – ${kg(i.intervalSanatosKg[1])}`,
    },
    {
      eticheta: i.reper.varianta === "A" ? "Exces față de Devine" : "Peste limita de sus a intervalului",
      valoare: i.reper.excesKg === null ? "—" : kg(i.reper.excesKg),
    },
    { eticheta: "Devine (informativ)", valoare: i.devineKg === null ? "nedefinită" : kg(i.devineKg) },
    { eticheta: "PGC Deurenberg", valoare: proc(i.pgcDeurenberg) },
    { eticheta: "PGC US Navy", valoare: i.pgcNavy === null ? "lipsesc măsurătorile" : proc(i.pgcNavy) },
    {
      eticheta: "Raport talie/înălțime",
      valoare: i.talieInaltime === null ? "—" : fmtNumar(i.talieInaltime, 3),
    },
    { eticheta: "Harris-Benedict", valoare: kcal(rez.rmb.harrisBenedict) },
    { eticheta: "Mifflin-St Jeor", valoare: kcal(rez.rmb.mifflinStJeor) },
    { eticheta: `Katch-McArdle (PGC ${rez.rmb.pgcFolosit})`, valoare: kcal(rez.rmb.katchMcArdle) },
    { eticheta: `RMB (${rez.rmb.varianta})`, valoare: kcal(rez.rmb.valoare) },
    {
      eticheta: "Coeficient de activitate",
      valoare: `${fmtNumar(rez.activitate.coef, 3)} (${rez.activitate.sursa}: ${rez.activitate.explicatie})`,
    },
    { eticheta: "Menținere", valoare: kcal(rez.mentinereKcal) },
    {
      eticheta: "Țintă",
      valoare:
        kcal(rez.tintaKcal) +
        (rez.pragMinimAtins ? " (prag minim atins)" : rez.deficitAplicat ? " (cu deficit)" : " (fără deficit)"),
    },
  ]

  if (rez.macro) {
    const m = rez.macro
    randuri.push(
      { eticheta: `Macronutrienți (${m.varianta})`, valoare: `pe greutatea de ${kg(m.greutateReferintaKg)}` },
      { eticheta: "Proteine", valoare: `${g(m.proteineG)} (${fmtProcent(m.procente.proteine)})` },
      { eticheta: "Grăsimi", valoare: `${g(m.grasimiG)} (${fmtProcent(m.procente.grasimi)})` },
      { eticheta: "Carbohidrați", valoare: `${g(m.carbohidratiG)} (${fmtProcent(m.procente.carbohidrati)})` },
    )
  } else {
    randuri.push({ eticheta: "Macronutrienți", valoare: "FĂRĂ PLAN: carbohidrați negativi" })
  }

  randuri.push({
    eticheta: `Apă (${rez.apa.varianta}: ${rez.apa.eticheta})`,
    valoare: `${fmtMl(rez.apa.minMl)} – ${fmtMl(rez.apa.maxMl)}, pe ${kg(rez.apa.greutateFolositaKg)}`,
  })

  if (rez.ritm === null) {
    randuri.push({ eticheta: "Ritm", valoare: "— (fără deficit)" })
  } else if (rez.ritm.varianta === "A") {
    randuri.push({
      eticheta: "Ritm (A: tabel)",
      valoare: rez.ritm.tabel
        .map((r) => `${r.perioada}: ${r.kgMin === r.kgMax ? kg(r.kgMin) : `${kg(r.kgMin)} – ${kg(r.kgMax)}`}`)
        .join("; "),
    })
  } else {
    randuri.push({
      eticheta: "Ritm (B: din deficit)",
      valoare: `≈ ${fmtNumar(rez.ritm.kgPeSaptamana, 2)} kg/săpt.; reper în 6 luni: ${kg(rez.ritm.reper6LuniKg[0])} – ${kg(rez.ritm.reper6LuniKg[1])}`,
    })
  }

  randuri.push(
    {
      eticheta: "Ținte pe mese (mic dejun, gustare, prânz, gustare, cină)",
      valoare: rez.tinteMeseKcal ? rez.tinteMeseKcal.map((v) => kcal(v)).join(" / ") : "—",
    },
    { eticheta: "Versiunea configurării", valoare: rez.versiuneConfig },
  )
  return randuri
}
