// Opririle de siguranță. Se verifică înaintea oricărui calcul de plan și nu depind de
// varianta de calcul aleasă.

import { PROTECTII } from "./config"
import { fmtIMC } from "./afisare"
import type { Oprire } from "./tipuri"

/** Toate câmpurile sunt opționale, ca interviul să poată verifica opririle pe măsură ce află răspunsurile. */
export interface DateOpriri {
  varstaAni?: number
  sarcinaSauAlaptare?: boolean
  diabetCuInsulina?: boolean
  imc?: number
  scoffRaspunsuriDa?: number
  semnalTulburariAlimentare?: boolean
}

export function verificaOpriri(d: DateOpriri): Oprire[] {
  // Sub 18 ani: oprire imediată, fără nicio dată de sănătate în fișă.
  if (d.varstaAni !== undefined && d.varstaAni < PROTECTII.varstaMinimaAni) {
    return [{ tip: "minor", detaliu: `Vârstă sub ${PROTECTII.varstaMinimaAni} ani.` }]
  }

  const opriri: Oprire[] = []
  if (d.sarcinaSauAlaptare) {
    opriri.push({ tip: "sarcina_alaptare", detaliu: "Sarcină sau alăptare declarată." })
  }
  if (d.diabetCuInsulina) {
    opriri.push({ tip: "insulina", detaliu: "Diabet tratat cu insulină." })
  }
  if (d.imc !== undefined && d.imc < PROTECTII.imcMinim) {
    opriri.push({ tip: "imc_sub_18_5", detaliu: `IMC ${fmtIMC(d.imc)}, sub ${fmtIMC(PROTECTII.imcMinim)}.` })
  }
  const scoff = d.scoffRaspunsuriDa ?? 0
  if (scoff >= PROTECTII.scoffPragOprire || d.semnalTulburariAlimentare) {
    opriri.push({
      tip: "tulburari_alimentare",
      detaliu:
        scoff >= PROTECTII.scoffPragOprire
          ? `SCOFF: ${scoff} răspunsuri „da” din 5 (prag ${PROTECTII.scoffPragOprire}). Este un test de depistare, nu un diagnostic.`
          : "Semnal de tulburare alimentară din răspunsurile libere.",
    })
  }
  return opriri
}
