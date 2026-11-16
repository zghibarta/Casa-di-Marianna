// Semnalele pentru Mariana care nu opresc interviul. Mesajele conțin cifre: sunt pentru
// fișa ei, niciodată pentru clientă.

import type { ConfigEvaluare } from "./config"
import { fmtCm, fmtIMC, fmtNumar } from "./afisare"
import { INALTIME_MINIMA_DEVINE_CM } from "./formule"
import type { CodSemnal, IntrareCalcul, Semnal } from "./tipuri"

export function semnal(cod: CodSemnal, nivel: Semnal["nivel"], mesaj: string): Semnal {
  return { cod, nivel, mesaj }
}

/** Semnalele care depind doar de răspunsuri și de IMC, nu de calculul planului. */
export function semnaleContext(intrare: IntrareCalcul, valoareImc: number, config: ConfigEvaluare): Semnal[] {
  const s = config.semnale
  const c = intrare.context ?? {}
  const rezultat: Semnal[] = []

  if (c.boliCronice) rezultat.push(semnal("boala_cronica", "atentie", "Boală cronică declarată."))
  if (c.tratament) rezultat.push(semnal("tratament", "atentie", "Tratament medicamentos în curs."))
  if (c.alergii) rezultat.push(semnal("alergie", "atentie", "Alergii declarate."))
  if (c.interventii) rezultat.push(semnal("interventie", "informativ", "Intervenții chirurgicale în antecedente."))
  if (c.suplimente) rezultat.push(semnal("supliment", "informativ", "Ia suplimente alimentare."))
  if (c.fumat) rezultat.push(semnal("fumat", "informativ", "Fumează."))
  if (c.alcoolPeSaptamana !== undefined && c.alcoolPeSaptamana >= s.alcoolFrecventPeSaptamana) {
    rezultat.push(
      semnal("alcool_frecvent", "atentie", `Alcool de circa ${fmtNumar(c.alcoolPeSaptamana)} ori pe săptămână.`),
    )
  }
  if (c.somnOre !== undefined && c.somnOre < s.somnMinimOre) {
    rezultat.push(semnal("somn_scurt", "atentie", `Somn de circa ${fmtNumar(c.somnOre)} ore pe noapte.`))
  }
  if (c.apaLitri !== undefined && c.apaLitri < s.apaMinimaLitri) {
    rezultat.push(semnal("apa_putina", "informativ", `Bea circa ${fmtNumar(c.apaLitri)} l de apă pe zi.`))
  }
  if (c.motivatieMinima !== undefined && c.motivatieMinima <= s.motivatieScazutaMax) {
    rezultat.push(semnal("motivatie_scazuta", "atentie", `Motivație declarată: ${c.motivatieMinima} din 10.`))
  }
  if (valoareImc >= s.imcAtentie) {
    rezultat.push(semnal("imc_35", "atentie", `IMC ${fmtIMC(valoareImc)} (≥ ${s.imcAtentie}).`))
  }
  if (intrare.varstaAni >= s.varstaAtentie) {
    rezultat.push(semnal("varsta_65", "atentie", `Vârstă ${intrare.varstaAni} ani (≥ ${s.varstaAtentie}).`))
  }
  if (intrare.sex === "B") {
    rezultat.push(
      semnal(
        "formule_barbati",
        "informativ",
        "Formulele pentru bărbați nu apar în studiul de caz; sunt variantele publicate, de confirmat.",
      ),
    )
  }
  if (intrare.inaltimeCm < INALTIME_MINIMA_DEVINE_CM) {
    rezultat.push(
      semnal(
        "devine_nedefinita",
        "informativ",
        `Înălțime ${fmtCm(intrare.inaltimeCm)}: formula Devine nu este definită sub 152,4 cm.`,
      ),
    )
  }
  return rezultat
}

/** Semnalele de talie; doar cu indicatorii activi și talia măsurată. */
export function semnaleTalie(intrare: IntrareCalcul, config: ConfigEvaluare): Semnal[] {
  const talie = intrare.masuratori?.talie
  if (!config.metoda.indicatoriTalie || talie === undefined) return []
  const s = config.semnale
  const [crescut, multCrescut] = s.talieCm[intrare.sex]
  const rezultat: Semnal[] = []
  if (talie > multCrescut) {
    rezultat.push(
      semnal("talie_mult_crescuta", "atentie", `Talie ${fmtCm(talie)}: risc mult crescut (peste ${multCrescut} cm).`),
    )
  } else if (talie > crescut) {
    rezultat.push(semnal("talie_crescuta", "atentie", `Talie ${fmtCm(talie)}: risc crescut (peste ${crescut} cm).`))
  }
  const raport = talie / intrare.inaltimeCm
  if (raport >= s.talieInaltimePrag) {
    rezultat.push(
      semnal("talie_inaltime", "atentie", `Raport talie/înălțime ${fmtNumar(raport, 2)} (prag ${s.talieInaltimePrag}).`),
    )
  }
  return rezultat
}
