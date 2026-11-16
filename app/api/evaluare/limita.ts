// Limită simplă pe adresă IP, ținută în memoria procesului: cel mult TRIMITERE.maxCereriPeIp
// cereri în TRIMITERE.fereastraMinute. Nu se scrie nimic pe disc sau în vreo bază de date.
//
// Pe Vercel fiecare instanță a funcției are memoria ei, deci limita este „cel puțin atât de
// strictă pe o instanță”, nu o garanție globală. Pentru o limită fermă se poate adăuga o regulă
// în Vercel Firewall pe /api/evaluare, fără schimbări de cod.

import { TRIMITERE } from "@/lib/evaluare/config"

const cereri = new Map<string, number[]>()
const MAX_ADRESE = 5000

export function permiteCerere(ip: string, acum: number = Date.now()): boolean {
  const fereastra = TRIMITERE.fereastraMinute * 60_000
  const recente = (cereri.get(ip) ?? []).filter((t) => acum - t < fereastra)
  const permis = recente.length < TRIMITERE.maxCereriPeIp
  if (permis) recente.push(acum)
  cereri.set(ip, recente)

  if (cereri.size > MAX_ADRESE) {
    for (const [adresa, momente] of cereri) {
      if (momente.every((t) => acum - t >= fereastra)) cereri.delete(adresa)
    }
  }
  return permis
}

/** Adresa clientului, așa cum o pune platforma în antete (pe Vercel nu poate fi falsificată). */
export function ipClient(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim()
  if (real) return real
  const lant = request.headers.get("x-forwarded-for")
  return lant?.split(",")[0]?.trim() || "necunoscut"
}

/** Doar pentru teste. */
export function reseteazaLimita(): void {
  cereri.clear()
}
