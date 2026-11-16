// Cazurile T1–T7 din docs/evaluare/plan.md §4. Datele sunt cele anonime din plan.

import { describe, expect, it } from "vitest"
import { rotunjit as r } from "../afisare"
import { calculeazaFisa, calculeazaMacro } from "../calcul"
import { CONFIG_IMPLICIT, VARIANTA_A, VARIANTA_B, type ConfigEvaluare } from "../config"
import type { IntrareCalcul, RezultatCalculat, RezultatCalcul } from "../tipuri"

function calculat(rez: RezultatCalcul): RezultatCalculat {
  if (rez.stare !== "calculat") throw new Error(`Așteptam un calcul, am primit o oprire: ${JSON.stringify(rez)}`)
  return rez
}
const coduri = (rez: RezultatCalcul) => rez.semnale.map((s) => s.cod)

const STUDIU: IntrareCalcul = {
  sex: "F",
  varstaAni: 30,
  inaltimeCm: 170,
  greutateKg: 84.5,
  coefActivitate: 1.375,
  scopSlabire: true,
}

describe("T1: studiul de caz, varianta A", () => {
  const rez = calculat(calculeazaFisa(STUDIU, VARIANTA_A))

  it("indicatori", () => {
    expect(r(rez.indicatori.imc, 2)).toBe(29.24)
    expect(rez.indicatori.clasaImc).toBe("suprapondere")
    expect(r(rez.indicatori.devineKg as number, 2)).toBe(61.34)
    expect(r(rez.indicatori.reper.excesKg as number, 2)).toBe(23.16)
    expect(r(rez.indicatori.pgcDeurenberg, 2)).toBe(36.59)
  })

  it("RMB, menținere și țintă", () => {
    expect(r(rez.rmb.harrisBenedict, 1)).toBe(1625.7)
    expect(r(rez.rmb.mifflinStJeor, 1)).toBe(1596.5)
    expect(r(rez.rmb.katchMcArdle, 1)).toBe(1527.4)
    expect(r(rez.rmb.valoare, 1)).toBe(1583.2)
    expect(r(rez.mentinereKcal, 1)).toBe(2176.9)
    expect(r(rez.tintaKcal, 1)).toBe(1676.9)
    expect(rez.deficitAplicat).toBe(true)
    expect(rez.pragMinimAtins).toBe(false)
  })

  it("macronutrienți și apă", () => {
    expect(r(rez.macro!.proteineG, 1)).toBe(101.4)
    expect(r(rez.macro!.grasimiG, 2)).toBe(76.05)
    expect(r(rez.macro!.carbohidratiG, 1)).toBe(146.7)
    expect(r(rez.apa.minMl, 1)).toBe(2535)
    expect(r(rez.apa.maxMl, 1)).toBe(3380)
  })

  it("semnalează grăsimile peste 35% și carbohidrații sub 45%", () => {
    expect(r(rez.macro!.procente.grasimi * 100, 0)).toBe(41)
    expect(r(rez.macro!.procente.carbohidrati * 100, 0)).toBe(35)
    expect(coduri(rez)).toContain("grasimi_peste_35")
    expect(coduri(rez)).toContain("carbohidrati_sub_45")
  })

  it("ritmul A este tabelul procentual, cu aritmetică corectă", () => {
    const ritm = rez.ritm
    if (ritm?.varianta !== "A") throw new Error("Așteptam ritmul în varianta A")
    const kgMax = (perioada: string) => ritm.tabel.find((x) => x.perioada === perioada)!.kgMax
    expect(r(kgMax("6 luni"), 2)).toBe(8.45)
    expect(r(kgMax("1 an"), 1)).toBe(16.9)
  })
})

describe("T1b: abatere față de cifrele din studiul Marianei", () => {
  const rez = calculat(calculeazaFisa(STUDIU, VARIANTA_A))

  it("cel mult 1 kcal față de 1625 / 1596 / 1528 / 1583 / 2176 / 1676", () => {
    expect(Math.abs(rez.rmb.harrisBenedict - 1625)).toBeLessThanOrEqual(1)
    expect(Math.abs(rez.rmb.mifflinStJeor - 1596)).toBeLessThanOrEqual(1)
    expect(Math.abs(rez.rmb.katchMcArdle - 1528)).toBeLessThanOrEqual(1)
    expect(Math.abs(rez.rmb.valoare - 1583)).toBeLessThanOrEqual(1)
    expect(Math.abs(rez.mentinereKcal - 2176)).toBeLessThanOrEqual(1)
    expect(Math.abs(rez.tintaKcal - 1676)).toBeLessThanOrEqual(1)
  })

  it("IMC ±0,01 și PGC ±0,02", () => {
    expect(Math.abs(rez.indicatori.imc - 29.23)).toBeLessThanOrEqual(0.01)
    expect(Math.abs(rez.indicatori.pgcDeurenberg - 36.57)).toBeLessThanOrEqual(0.02)
  })
})

describe("T2: studiul de caz, varianta B, cu măsurători", () => {
  const intrare: IntrareCalcul = { ...STUDIU, masuratori: { gat: 38, talie: 87, solduri: 110 } }
  const rez = calculat(calculeazaFisa(intrare, VARIANTA_B))

  it("PGC Navy, Katch și RMB (B1)", () => {
    expect(r(rez.indicatori.pgcNavy as number, 2)).toBe(36.18)
    expect(rez.rmb.pgcFolosit).toBe("navy")
    expect(r(rez.rmb.katchMcArdle, 1)).toBe(1534.8)
    expect(r(rez.rmb.valoare, 1)).toBe(1585.7)
  })

  it("interval de greutate, raport talie/înălțime și semnal de talie", () => {
    expect(r(rez.indicatori.intervalSanatosKg[0], 1)).toBe(53.5)
    expect(r(rez.indicatori.intervalSanatosKg[1], 1)).toBe(72.0)
    expect(r(rez.indicatori.reper.excesKg as number, 1)).toBe(12.5)
    expect(r(rez.indicatori.talieInaltime as number, 3)).toBe(0.512)
    expect(coduri(rez)).toContain("talie_crescuta")
    expect(coduri(rez)).toContain("talie_inaltime")
  })

  it("cu ținta 1676,9: grăsimi 55,9 g și carbohidrați 192,1 g", () => {
    const tintaA = calculat(calculeazaFisa(STUDIU, VARIANTA_A)).tintaKcal
    const macro = calculeazaMacro({ greutateKg: 84.5, inaltimeCm: 170, tintaKcal: tintaA }, VARIANTA_B.metoda)!
    expect(r(macro.grasimiG, 1)).toBe(55.9)
    expect(r(macro.carbohidratiG, 1)).toBe(192.1)
    expect(r(macro.proteineG, 1)).toBe(101.4)
  })

  it("efectul complet din plan.md §2: menținere 2180, țintă 1680, ritm ≈ 0,45 kg/săpt.", () => {
    expect(r(rez.mentinereKcal, 0)).toBe(2180)
    expect(r(rez.tintaKcal, 0)).toBe(1680)
    expect(rez.ritm?.varianta).toBe("B")
    if (rez.ritm?.varianta === "B") {
      expect(r(rez.ritm.kgPeSaptamana, 2)).toBe(0.45)
      expect(r(rez.ritm.reper6LuniKg[0], 1)).toBe(4.2)
      expect(r(rez.ritm.reper6LuniKg[1], 1)).toBe(8.5)
    }
  })

  it("fără măsurători, B1 coincide cu A", () => {
    const faraMasuratori = calculat(calculeazaFisa(STUDIU, VARIANTA_B))
    const a = calculat(calculeazaFisa(STUDIU, VARIANTA_A))
    expect(faraMasuratori.rmb.pgcFolosit).toBe("deurenberg")
    expect(faraMasuratori.rmb.valoare).toBe(a.rmb.valoare)
    expect(faraMasuratori.indicatori.talieInaltime).toBeNull()
  })
})

describe("criteriu de acceptare: comutarea A → B doar pe grăsimi", () => {
  it("pentru T1 schimbă 76 g în 56 g și 147 g în 192 g", () => {
    const doarMacroB: ConfigEvaluare = { ...VARIANTA_A, metoda: { ...VARIANTA_A.metoda, macro: "B" } }
    const a = calculat(calculeazaFisa(STUDIU, VARIANTA_A)).macro!
    const b = calculat(calculeazaFisa(STUDIU, doarMacroB)).macro!
    expect([r(a.grasimiG), r(a.carbohidratiG)]).toEqual([76, 147])
    expect([r(b.grasimiG), r(b.carbohidratiG)]).toEqual([56, 192])
  })
})

describe("T3: prag minim", () => {
  const rez = calculat(
    calculeazaFisa(
      { sex: "F", varstaAni: 60, inaltimeCm: 155, greutateKg: 68, coefActivitate: 1.2, scopSlabire: true },
      VARIANTA_A,
    ),
  )

  it("ținta rămâne la 1200 kcal, cu semnal", () => {
    expect(r(rez.indicatori.imc, 2)).toBe(28.3)
    expect(r(rez.rmb.valoare, 1)).toBe(1233.7)
    expect(r(rez.mentinereKcal, 1)).toBe(1480.4)
    expect(rez.tintaKcal).toBe(1200)
    expect(rez.pragMinimAtins).toBe(true)
    expect(coduri(rez)).toContain("prag_minim")
  })

  it("macronutrienți A", () => {
    expect(r(rez.macro!.proteineG, 1)).toBe(81.6)
    expect(r(rez.macro!.grasimiG, 1)).toBe(61.2)
    expect(r(rez.macro!.carbohidratiG, 1)).toBe(80.7)
  })
})

describe("T4: bărbat (formule de confirmat)", () => {
  const rez = calculat(
    calculeazaFisa(
      { sex: "B", varstaAni: 40, inaltimeCm: 180, greutateKg: 95, coefActivitate: 1.375, scopSlabire: true },
      VARIANTA_A,
    ),
  )

  it("valorile așteptate", () => {
    expect(r(rez.indicatori.imc, 2)).toBe(29.32)
    expect(r(rez.rmb.harrisBenedict, 1)).toBe(1997.8)
    expect(r(rez.rmb.mifflinStJeor, 1)).toBe(1880)
    expect(r(rez.indicatori.pgcDeurenberg, 2)).toBe(28.19)
    expect(r(rez.rmb.katchMcArdle, 1)).toBe(1843.6)
    expect(r(rez.rmb.valoare, 1)).toBe(1907.2)
    expect(r(rez.tintaKcal, 1)).toBe(2122.3)
    expect(r(rez.indicatori.devineKg as number, 2)).toBe(74.84)
  })

  it("marchează formulele ca „de confirmat”", () => {
    expect(coduri(rez)).toContain("formule_barbati")
  })
})

describe("T5: carbohidrați negativi", () => {
  it("F, 100 kg, la ținta 1200, varianta A: fără macronutrienți", () => {
    expect(calculeazaMacro({ greutateKg: 100, inaltimeCm: 160, tintaKcal: 1200 }, VARIANTA_A.metoda)).toBeNull()
  })

  it("pe fluxul complet: fără plan + semnal", () => {
    const rez = calculat(
      calculeazaFisa(
        { sex: "F", varstaAni: 75, inaltimeCm: 150, greutateKg: 100, coefActivitate: 1.2, scopSlabire: true },
        VARIANTA_A,
      ),
    )
    expect(rez.tintaKcal).toBe(1200)
    expect(rez.macro).toBeNull()
    expect(rez.planPosibil).toBe(false)
    expect(rez.tinteMeseKcal).toBeNull()
    expect(coduri(rez)).toContain("macronutrienti_imposibili")
    expect(coduri(rez)).toContain("prag_minim")
  })

  it("protecția există și în varianta B", () => {
    const metoda = { ...VARIANTA_B.metoda, proteineGPeKg: 6 }
    expect(calculeazaMacro({ greutateKg: 100, inaltimeCm: 160, tintaKcal: 1200 }, metoda)).toBeNull()
  })
})

describe("T6: opriri de siguranță", () => {
  const baza: IntrareCalcul = { ...STUDIU }
  const cazuri: [string, IntrareCalcul, string][] = [
    ["17 ani", { ...baza, varstaAni: 17 }, "minor"],
    ["IMC 18,4", { ...baza, greutateKg: 18.4 * 1.7 * 1.7 }, "imc_sub_18_5"],
    ["sarcină sau alăptare", { ...baza, sarcinaSauAlaptare: true }, "sarcina_alaptare"],
    ["diabet tratat cu insulină", { ...baza, diabetCuInsulina: true }, "insulina"],
    ["SCOFF cu 2 răspunsuri „da”", { ...baza, scoffRaspunsuriDa: 2 }, "tulburari_alimentare"],
    ["semnal din text liber", { ...baza, semnalTulburariAlimentare: true }, "tulburari_alimentare"],
  ]

  for (const config of [VARIANTA_A, VARIANTA_B, CONFIG_IMPLICIT]) {
    for (const [nume, intrare, tip] of cazuri) {
      it(`${nume} → fără plan (${config.versiune})`, () => {
        const rez = calculeazaFisa(intrare, config)
        expect(rez.stare).toBe("oprit")
        if (rez.stare !== "oprit") return
        expect(rez.opriri.map((o) => o.tip)).toContain(tip)
        // Fără ținte și fără plan: rezultatul oprit nu are aceste câmpuri deloc.
        expect(rez).not.toHaveProperty("tintaKcal")
        expect(rez).not.toHaveProperty("macro")
        expect(rez).not.toHaveProperty("mentinereKcal")
      })
    }
  }

  it("sub 18 ani nu se păstrează niciun semnal de sănătate", () => {
    const rez = calculeazaFisa(
      { ...baza, varstaAni: 17, sarcinaSauAlaptare: true, context: { boliCronice: true, fumat: true } },
      CONFIG_IMPLICIT,
    )
    expect(rez.stare).toBe("oprit")
    if (rez.stare !== "oprit") return
    expect(rez.opriri).toHaveLength(1)
    expect(rez.semnale).toHaveLength(0)
  })

  it("un singur „da” la SCOFF și IMC exact 18,5 nu opresc", () => {
    expect(calculeazaFisa({ ...baza, scoffRaspunsuriDa: 1 }, CONFIG_IMPLICIT).stare).toBe("calculat")
    expect(calculeazaFisa({ ...baza, inaltimeCm: 200, greutateKg: 74 }, CONFIG_IMPLICIT).stare).toBe("calculat")
  })
})

describe("T7: fără deficit la IMC sub 25", () => {
  it("IMC 23 cu scop de slăbire → țintă = menținere + semnal", () => {
    const rez = calculat(
      calculeazaFisa(
        { sex: "F", varstaAni: 30, inaltimeCm: 170, greutateKg: 66.5, coefActivitate: 1.375, scopSlabire: true },
        VARIANTA_A,
      ),
    )
    expect(r(rez.indicatori.imc, 0)).toBe(23)
    expect(rez.tintaKcal).toBe(rez.mentinereKcal)
    expect(rez.deficitAplicat).toBe(false)
    expect(rez.ritm).toBeNull()
    expect(coduri(rez)).toContain("imc_sub_25_slabire")
  })

  it("fără scop de slăbire: menținere, fără semnal", () => {
    const rez = calculat(calculeazaFisa({ ...STUDIU, scopSlabire: false }, VARIANTA_A))
    expect(rez.tintaKcal).toBe(rez.mentinereKcal)
    expect(coduri(rez)).not.toContain("imc_sub_25_slabire")
  })
})

describe("alte protecții și semnale", () => {
  it("ritmul dorit peste ce permite deficitul produce semnal", () => {
    // 3–4 kg pe lună, exemplul din plan.md
    const rez = calculat(calculeazaFisa({ ...STUDIU, ritmDoritKgPeSaptamana: 3.5 / (52 / 12) }, CONFIG_IMPLICIT))
    expect(coduri(rez)).toContain("ritm_dorit")
    const ok = calculat(calculeazaFisa({ ...STUDIU, ritmDoritKgPeSaptamana: 0.3 }, CONFIG_IMPLICIT))
    expect(coduri(ok)).not.toContain("ritm_dorit")
  })

  it("varianta B folosește greutatea de referință la IMC ≥ 30 (exemplul 110 kg / 170 cm: 132 g → 87 g)", () => {
    const intrare: IntrareCalcul = { ...STUDIU, greutateKg: 110 }
    const a = calculat(calculeazaFisa(intrare, VARIANTA_A)).macro!
    const b = calculat(calculeazaFisa(intrare, VARIANTA_B))
    expect(r(a.proteineG)).toBe(132)
    expect(r(b.macro!.proteineG)).toBe(87)
    expect(r(b.apa.greutateFolositaKg, 2)).toBe(72.25)
    expect(b.apa.eticheta).toBe("lichide totale")
  })

  it("sub 152,4 cm Devine este nedefinită și apare semnalul", () => {
    const rez = calculat(calculeazaFisa({ ...STUDIU, inaltimeCm: 150, greutateKg: 65 }, VARIANTA_A))
    expect(rez.indicatori.devineKg).toBeNull()
    expect(rez.indicatori.reper.excesKg).toBeNull()
    expect(coduri(rez)).toContain("devine_nedefinita")
  })

  it("semnalele din context", () => {
    const rez = calculat(
      calculeazaFisa(
        {
          ...STUDIU,
          varstaAni: 66,
          context: { boliCronice: true, alcoolPeSaptamana: 3.5, somnOre: 5.5, apaLitri: 0.75, motivatieMinima: 4 },
        },
        CONFIG_IMPLICIT,
      ),
    )
    expect(coduri(rez)).toEqual(
      expect.arrayContaining([
        "boala_cronica",
        "alcool_frecvent",
        "somn_scurt",
        "apa_putina",
        "motivatie_scazuta",
        "varsta_65",
      ]),
    )
  })

  it("respinge date de intrare și configurări invalide", () => {
    expect(() => calculeazaFisa({ ...STUDIU, inaltimeCm: 0 })).toThrow(RangeError)
    expect(() => calculeazaFisa({ ...STUDIU, greutateKg: Number.NaN })).toThrow(RangeError)
    const invalid: ConfigEvaluare = { ...VARIANTA_B, metoda: { ...VARIANTA_B.metoda, procentGrasimi: 0.5 } }
    expect(() => calculeazaFisa(STUDIU, invalid)).toThrow(/procentGrasimi/)
  })

  it("configurarea implicită salvează versiunea folosită", () => {
    expect(calculeazaFisa(STUDIU).versiuneConfig).toBe(CONFIG_IMPLICIT.versiune)
  })
})
