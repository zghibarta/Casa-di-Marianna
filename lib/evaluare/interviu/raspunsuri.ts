// Răspunsurile clientei, așa cum le ține interfața, și funcții mici de citire.

import type { Intensitate } from "../tipuri"

/** Un rând din orarul de activități, cu valorile brute scrise de clientă. */
export interface RandAntrenament {
  tip: string
  ori: string
  durata: string
  intensitate: Intensitate | ""
}

/**
 * text, număr (ca text brut, cu virgulă sau punct), dată AAAA-LL-ZZ, oră HH:MM,
 * „da”/„nu”, id-ul opțiunii alese, lista de opțiuni sau orarul de activități.
 */
export type Valoare = string | string[] | RandAntrenament[]
export type Raspunsuri = Record<string, Valoare | undefined>

export function text(r: Raspunsuri, id: string): string {
  const v = r[id]
  return typeof v === "string" ? v.trim() : ""
}

/** Acceptă atât „84,5”, cât și „84.5”. */
export function parseazaNumar(brut: string): number | undefined {
  const curat = brut.trim().replace(",", ".")
  if (curat === "" || !/^-?\d+(\.\d+)?$/.test(curat)) return undefined
  return Number(curat)
}

export function numar(r: Raspunsuri, id: string): number | undefined {
  return parseazaNumar(text(r, id))
}

export function esteDa(r: Raspunsuri, id: string): boolean {
  return r[id] === "da"
}

export function lista(r: Raspunsuri, id: string): string[] {
  const v = r[id]
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []
}

export function antrenamente(r: Raspunsuri, id: string): RandAntrenament[] {
  const v = r[id]
  return Array.isArray(v) ? v.filter((x): x is RandAntrenament => typeof x === "object" && x !== null) : []
}

export function esteGol(v: Valoare | undefined): boolean {
  if (v === undefined) return true
  if (typeof v === "string") return v.trim() === ""
  return v.length === 0
}
