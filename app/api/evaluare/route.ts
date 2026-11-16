// POST /api/evaluare: primește răspunsurile la „Trimite”, le validează din nou, calculează fișa
// și o trimite pe email la Casa di Marianna.
//
// Fără bază de date, fără fișiere și fără jurnal cu răspunsuri: datele există doar cât durează
// cererea. În jurnal ajung numai coduri de eroare, niciodată conținutul cererii.

import { NextResponse } from "next/server"
import { CONFIG_IMPLICIT, TRIMITERE } from "@/lib/evaluare/config"
import { proceseazaCerere } from "@/lib/evaluare/trimitere/cerere"
import type { CodRefuz, RaspunsServer } from "@/lib/evaluare/trimitere/protocol"
import type { TipOprire } from "@/lib/evaluare/tipuri"
import { ipClient, permiteCerere } from "./limita"
import { trimiteEmail } from "./transport"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

const FARA_CACHE = { "Cache-Control": "no-store" }

function raspunde(status: number, corp: RaspunsServer) {
  return NextResponse.json(corp, { status, headers: FARA_CACHE })
}
const refuza = (status: number, cod: CodRefuz, oprire?: TipOprire) => raspunde(status, { ok: false, cod, oprire })

export async function POST(request: Request) {
  if (!permiteCerere(ipClient(request))) return refuza(429, "prea_multe_cereri")

  let brut: string
  try {
    brut = await request.text()
  } catch {
    return refuza(400, "cerere_invalida")
  }
  if (brut.length > TRIMITERE.maxCaractereCerere) return refuza(413, "cerere_prea_mare")

  let corp: unknown
  try {
    corp = JSON.parse(brut)
  } catch {
    return refuza(400, "cerere_invalida")
  }

  const rezultat = proceseazaCerere(corp, CONFIG_IMPLICIT, new Date())
  if (rezultat.stare === "refuz") return refuza(rezultat.status, rezultat.cod, rezultat.oprire)
  // Capcana anti-spam: robotul primește un răspuns de succes, dar nu pleacă niciun email.
  if (rezultat.stare === "ignora") return raspunde(200, { ok: true })

  const trimis = await trimiteEmail(rezultat.email)
  if (trimis.ok) return raspunde(200, { ok: true })

  if (trimis.motiv === "neconfigurat") {
    console.error(`[evaluare] trimitere neconfigurată; lipsesc variabilele: ${trimis.lipsa.join(", ")}`)
    return refuza(503, "trimitere_neconfigurata")
  }
  console.error(`[evaluare] trimiterea emailului a eșuat (cod ${trimis.cod})`)
  return refuza(502, "trimitere_esuata")
}
