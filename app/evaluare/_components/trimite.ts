// Trimiterea spre ruta de pe server. Nu aruncă erori: orice eșec devine un cod, ca formularul
// să rămână neatins și clienta să vadă un mesaj clar.

import { UI } from "@/lib/evaluare/interviu/texte"
import { RUTA_TRIMITERE, type Cerere, type CodRefuz, type RaspunsServer } from "@/lib/evaluare/trimitere/protocol"
import type { TipOprire } from "@/lib/evaluare/tipuri"

export type RezultatTrimitere = { ok: true } | { ok: false; cod: CodRefuz | "retea"; oprire?: TipOprire }

const TIMP_MAXIM_MS = 30_000

export async function trimiteLaServer(cerere: Cerere): Promise<RezultatTrimitere> {
  const control = new AbortController()
  const cronometru = setTimeout(() => control.abort(), TIMP_MAXIM_MS)
  try {
    const raspuns = await fetch(RUTA_TRIMITERE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cerere),
      signal: control.signal,
      cache: "no-store",
    })
    const corp = (await raspuns.json().catch(() => null)) as RaspunsServer | null
    if (raspuns.ok && corp?.ok === true) return { ok: true }
    if (corp && corp.ok === false && typeof corp.cod === "string") {
      return { ok: false, cod: corp.cod, oprire: corp.oprire }
    }
    return { ok: false, cod: raspuns.status === 429 ? "prea_multe_cereri" : "trimitere_esuata" }
  } catch {
    return { ok: false, cod: "retea" }
  } finally {
    clearTimeout(cronometru)
  }
}

export function mesajEroare(cod: CodRefuz | "retea", doarContact = false): string {
  switch (cod) {
    case "prea_multe_cereri":
      return UI.eroarePreaMulte
    case "raspunsuri_invalide":
      return UI.eroareRaspunsuri
    case "fara_consimtamant":
      return UI.eroareConsimtamant
    case "contact_invalid":
      return UI.eroareContact
    default:
      return doarContact ? UI.eroareTrimitereContact : UI.eroareTrimitere
  }
}
