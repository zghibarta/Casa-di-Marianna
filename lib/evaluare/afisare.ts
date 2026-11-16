// Rotunjirea se face doar aici, la afișare: kcal și grame la întreg, IMC și procente la o zecimală.

export function rotunjit(valoare: number, zecimale = 0): number {
  const f = 10 ** zecimale
  return Math.round(valoare * f) / f
}

function fmt(valoare: number, zecimale: number): string {
  return rotunjit(valoare, zecimale).toLocaleString("ro-RO", {
    minimumFractionDigits: zecimale,
    maximumFractionDigits: zecimale,
    useGrouping: false,
  })
}

export const fmtKcal = (v: number) => `${fmt(v, 0)} kcal`
export const fmtGrame = (v: number) => `${fmt(v, 0)} g`
export const fmtKg = (v: number) => `${fmt(v, 1)} kg`
export const fmtCm = (v: number) => `${fmt(v, 0)} cm`
export const fmtMl = (v: number) => `${fmt(v, 0)} ml`
export const fmtIMC = (v: number) => fmt(v, 1)
/** Primește o fracție (0,30) și afișează „30,0%”. */
export const fmtProcent = (fractie: number) => `${fmt(fractie * 100, 1)}%`
export const fmtNumar = (v: number, zecimale = 1) => fmt(v, zecimale)
