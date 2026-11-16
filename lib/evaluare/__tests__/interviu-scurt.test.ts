// Interviul scurt (implicit): 10 ecrane, doar ce trebuie pentru evaluarea inițială.
// Verifică structura, opririle de siguranță și că datele scurte ajung pentru calculul complet.

import { describe, expect, it } from "vitest"
import { propuneCoeficient } from "../activitate"
import { rotunjit as r } from "../afisare"
import { calculeazaFisa } from "../calcul"
import { CONFIG_IMPLICIT, PROTECTII, VARIANTA_A, VARIANTA_B, type ConfigEvaluare } from "../config"
import { raspunsuriExempluScurt } from "../interviu/exemplu"
import {
  campuriVizibile,
  eroriPas,
  oprireDinRaspunsuri,
  pasiVizibili,
  progres,
  raspunsuriActive,
  totalEcrane,
} from "../interviu/graf"
import { PASI_SCURT, pasiInterviu, type Pas } from "../interviu/intrebari"
import { construiesteIntrare, randuriFisa } from "../interviu/mapare"
import type { Raspunsuri } from "../interviu/raspunsuri"
import { construiesteRezumat, verificaRezumat } from "../interviu/rezumat"
import { INTRO_PASI, OPTIUNI, UI, textCamp, textInformare } from "../interviu/texte"
import type { Autoapreciere, RezultatCalcul, RezultatCalculat } from "../tipuri"

const AZI = new Date(2026, 10, 16)
const cfg = CONFIG_IMPLICIT
const exemplu = raspunsuriExempluScurt()
const pas = (id: string): Pas => PASI_SCURT.find((p) => p.id === id)!
const vizibile = (idPas: string, rasp: Raspunsuri) => campuriVizibile(pas(idPas), rasp, cfg).map((c) => c.id)
const calcul = (rasp: Raspunsuri, config: ConfigEvaluare = cfg): RezultatCalcul =>
  calculeazaFisa(construiesteIntrare(rasp, config, { azi: AZI })!, config)
function calculat(rez: RezultatCalcul): RezultatCalculat {
  if (rez.stare !== "calculat") throw new Error(`Așteptam un calcul, am primit o oprire: ${JSON.stringify(rez.opriri)}`)
  return rez
}

describe("structura interviului scurt", () => {
  it("este varianta implicită și are 10 ecrane cu tot cu consimțământ", () => {
    expect(cfg.interviu.varianta).toBe("scurt")
    expect(pasiInterviu(cfg)).toBe(PASI_SCURT)
    expect(PASI_SCURT.map((p) => p.id)).toEqual([
      "despre",
      "corp",
      "scop",
      "sanatate",
      "alergii",
      "activitate",
      "mese",
      "scoff",
      "contact",
    ])
    expect(totalEcrane({}, cfg)).toBe(10)
    expect(totalEcrane(exemplu, cfg)).toBeLessThanOrEqual(10)
  })

  it("fiecare câmp are o formulare, id-urile sunt unice și opțiunile există", () => {
    const campuri = PASI_SCURT.flatMap((p) => p.campuri)
    const ids = campuri.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const camp of campuri) {
      expect(textCamp(camp.id, "scurt")?.intrebare, camp.id).toBeTruthy()
      if (camp.tip === "alegere" || camp.tip === "alegere_multipla") {
        expect(OPTIUNI[camp.optiuni!], camp.id).toBeTruthy()
      }
    }
  })

  it("nu are câmpuri de text lung obligatorii", () => {
    const campuri = PASI_SCURT.flatMap((p) => p.campuri)
    expect(campuri.filter((c) => c.tip === "text_lung" && c.obligatoriu)).toEqual([])
    // singurele texte obligatorii sunt numele și contactul
    expect(campuri.filter((c) => c.tip === "text" && c.obligatoriu).map((c) => c.id)).toEqual(["nume", "contact"])
  })

  it("nu mai întreabă ce s-a scos din chestionar", () => {
    const ids = PASI_SCURT.flatMap((p) => p.campuri.map((c) => c.id))
    const scoase = [
      "ocupatie",
      "greutate_maxima",
      "greutate_minima",
      "grupa_sanguina",
      "interventii",
      "traume",
      "antecedente",
      "suplimente",
      "fumat",
      "motivatie_schimbare",
      "motivatie_recomandari",
      "ora_trezire",
      "ora_culcare",
      "somn",
      "apa_litri",
      "alte_bauturi",
      "alcool_frecventa",
      "prima_masa",
      "ultima_masa",
      "masa_consistenta",
      "carne",
      "lactate",
      "cereale",
      "boboase",
      "nuci",
      "legume",
      "fructe",
      "peste",
      "oua",
      "fastfood",
      "dulciuri",
      "mirodenii",
      "antrenamente",
      "data_nasterii",
    ]
    for (const id of scoase) expect(ids, id).not.toContain(id)
  })

  it("bara de progres numără ecranele: înălțimea și greutatea sunt „Pasul 3 din 10”", () => {
    const p = progres("corp", exemplu, cfg)
    expect(p).toMatchObject({ pas: 3, totalPasi: 10, procent: 20 })
    expect(UI.pas(p.pas, p.totalPasi)).toBe("Pasul 3 din 10")
    expect(progres("despre", {}, cfg)).toMatchObject({ pas: 2, totalPasi: 10 })
    expect(progres("contact", exemplu, cfg)).toMatchObject({ pas: 10, totalPasi: 10, procent: 90 })
    expect(INTRO_PASI.contact).toBeTruthy()
  })

  it("primul ecran anunță durata, iar informarea arată adresa doar din configurare", () => {
    expect(UI.durata).toBe("Durează doar câteva minute.")
    expect(textInformare("adresa@example.com")).toContain("Casa di Marianna (adresa@example.com), la care")
    expect(textInformare()).toContain("Casa di Marianna, la care")
    // repo public: nicio adresă de email scrisă în texte
    expect(JSON.stringify(UI)).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/)
  })
})

describe("întrebări condiționale în interviul scurt", () => {
  it("sarcina se întreabă doar la femei", () => {
    expect(vizibile("despre", { sex: "B" })).toEqual(["varsta", "sex"])
    expect(vizibile("despre", { sex: "F" })).toEqual(["varsta", "sex", "sarcina_alaptare"])
  })

  it("insulina se întreabă doar dacă a bifat diabet", () => {
    expect(vizibile("sanatate", { afectiuni: ["tiroida"] })).toEqual(["afectiuni", "tratament_permanent"])
    expect(vizibile("sanatate", { afectiuni: ["diabet", "tiroida"] })).toEqual([
      "afectiuni",
      "insulina",
      "tratament_permanent",
    ])
  })

  it("kilogramele dorite apar doar la scopul de slăbire și sunt opționale", () => {
    expect(vizibile("scop", { scopuri: ["energie"] })).toEqual(["scopuri"])
    expect(vizibile("scop", { scopuri: ["slabire", "altul"] })).toEqual(["scopuri", "scop_altul", "scop_slabire_kg"])
    expect(eroriPas(pas("scop"), { scopuri: ["slabire", "altul"] }, cfg, AZI)).toEqual({})
  })

  it("un răspuns la insulină rămas după ce diabetul a fost debifat nu oprește și nu ajunge în fișă", () => {
    const rasp = { ...exemplu, afectiuni: ["tiroida"], insulina: "da" }
    expect(raspunsuriActive(rasp, cfg)).not.toHaveProperty("insulina")
    expect(oprireDinRaspunsuri(rasp, cfg, AZI)).toBeNull()
  })
})

describe("validare în interviul scurt", () => {
  it("exemplul este complet: niciun ecran nu are erori", () => {
    for (const p of pasiVizibili(exemplu, cfg)) expect(eroriPas(p, exemplu, cfg, AZI), p.id).toEqual({})
  })

  it("cere toate răspunsurile de siguranță", () => {
    expect(Object.keys(eroriPas(pas("despre"), { sex: "F" }, cfg, AZI))).toEqual(["varsta", "sarcina_alaptare"])
    expect(Object.keys(eroriPas(pas("sanatate"), { afectiuni: ["diabet"] }, cfg, AZI))).toEqual([
      "insulina",
      "tratament_permanent",
    ])
    expect(Object.keys(eroriPas(pas("sanatate"), {}, cfg, AZI))).toEqual(["afectiuni", "tratament_permanent"])
    expect(Object.keys(eroriPas(pas("scoff"), { scoff_1: "nu" }, cfg, AZI))).toHaveLength(4)
    expect(eroriPas(pas("alergii"), { alergii_alimentare: "nu" }, cfg, AZI)).toEqual({})
  })

  it("„niciuna” nu se combină cu o afecțiune, iar opțiunile necunoscute sunt respinse", () => {
    const baza = { tratament_permanent: "nu" }
    expect(eroriPas(pas("sanatate"), { ...baza, afectiuni: ["niciuna"] }, cfg, AZI)).toEqual({})
    expect(eroriPas(pas("sanatate"), { ...baza, afectiuni: ["niciuna", "tiroida"] }, cfg, AZI)).toHaveProperty("afectiuni")
    expect(eroriPas(pas("sanatate"), { ...baza, afectiuni: ["altceva"] }, cfg, AZI)).toHaveProperty("afectiuni")
    expect(eroriPas(pas("activitate"), { activitate_auto: "campion" }, cfg, AZI)).toHaveProperty("activitate_auto")
    expect(eroriPas(pas("sanatate"), { afectiuni: ["niciuna"], tratament_permanent: "poate" }, cfg, AZI)).toHaveProperty(
      "tratament_permanent",
    )
  })

  it("contactul trebuie să fie un telefon sau o adresă de email", () => {
    const cu = (contact: string) => eroriPas(pas("contact"), { nume: "Clientă de test", contact }, cfg, AZI)
    expect(cu("000 000 000")).toEqual({})
    expect(cu("+373 00 000 000")).toEqual({})
    expect(cu("cineva@example.com")).toEqual({})
    expect(cu("sunați-mă")).toHaveProperty("contact")
    expect(cu("")).toHaveProperty("contact")
    expect(eroriPas(pas("contact"), { nume: "", contact: "000 000 000" }, cfg, AZI)).toHaveProperty("nume")
  })

  it("limitează lungimea textelor", () => {
    const lung = "a".repeat(5000)
    expect(eroriPas(pas("contact"), { nume: "Clientă de test", contact: "000 000 000", mesaj: lung }, cfg, AZI)).toHaveProperty(
      "mesaj",
    )
    expect(eroriPas(pas("alergii"), { alergii_alimentare: "da", alimente_evitate: lung }, cfg, AZI)).toHaveProperty(
      "alimente_evitate",
    )
  })
})

describe("opririle de siguranță funcționează toate în interviul scurt", () => {
  const stop = (rasp: Raspunsuri) => oprireDinRaspunsuri(rasp, cfg, AZI)?.tip ?? null

  it("exemplul nu are nicio oprire", () => {
    expect(stop(exemplu)).toBeNull()
  })

  it("minori: sub 18 ani se oprește la ecranul 2, înaintea oricărei alte întrebări", () => {
    expect(stop({ varsta: "17" })).toBe("minor")
    expect(stop({ varsta: "18" })).toBeNull()
    expect(stop({ ...exemplu, varsta: "17" })).toBe("minor")
    expect(eroriPas(pas("despre"), { varsta: "17", sex: "B" }, cfg, AZI)).toEqual({})
  })

  it("sarcină sau alăptare", () => {
    expect(stop({ varsta: "30", sex: "F", sarcina_alaptare: "da" })).toBe("sarcina_alaptare")
    expect(stop({ ...exemplu, sarcina_alaptare: "da" })).toBe("sarcina_alaptare")
  })

  it("diabet tratat cu insulină (diabetul fără insulină nu oprește)", () => {
    expect(stop({ ...exemplu, afectiuni: ["diabet"], insulina: "da" })).toBe("insulina")
    expect(stop({ ...exemplu, afectiuni: ["diabet", "tiroida"], insulina: "da" })).toBe("insulina")
    expect(stop({ ...exemplu, afectiuni: ["diabet"], insulina: "nu" })).toBeNull()
  })

  it("IMC sub 18,5", () => {
    expect(stop({ ...exemplu, greutate: "53" })).toBe("imc_sub_18_5")
    expect(stop({ ...exemplu, greutate: "54" })).toBeNull()
  })

  it("SCOFF: pragul din PROTECTII oprește, un singur „da” nu", () => {
    expect(PROTECTII.scoffPragOprire).toBe(2)
    expect(stop({ ...exemplu, scoff_2: "da" })).toBeNull()
    expect(stop({ ...exemplu, scoff_2: "da", scoff_5: "da" })).toBe("tulburari_alimentare")
  })

  it("și motorul de calcul refuză planul pentru fiecare oprire", () => {
    const cazuri: [string, Raspunsuri][] = [
      ["minor", { ...exemplu, varsta: "17" }],
      ["sarcina_alaptare", { ...exemplu, sarcina_alaptare: "da" }],
      ["insulina", { ...exemplu, afectiuni: ["diabet"], insulina: "da" }],
      ["imc_sub_18_5", { ...exemplu, greutate: "53" }],
      ["tulburari_alimentare", { ...exemplu, scoff_1: "da", scoff_3: "da" }],
    ]
    for (const [tip, rasp] of cazuri) {
      const rez = calcul(rasp)
      expect(rez.stare, tip).toBe("oprit")
      if (rez.stare === "oprit") expect(rez.opriri.map((o) => o.tip)).toContain(tip)
      expect(rez).not.toHaveProperty("tintaKcal")
    }
  })
})

describe("varianta scurtă duce la calcul complet", () => {
  it("construiește intrarea motorului doar din datele scurte", () => {
    const intrare = construiesteIntrare(exemplu, cfg, { azi: AZI })!
    expect(intrare).toMatchObject({ sex: "F", varstaAni: 30, inaltimeCm: 170, greutateKg: 84.5, scopSlabire: true })
    expect(intrare.activitate).toEqual({ autoapreciere: "usor", antrenamente: [], doarAutoapreciere: true })
    expect(intrare.scoffRaspunsuriDa).toBe(0)
    // ce nu s-a întrebat lipsește, nu este presupus
    expect(intrare.ritmDoritKgPeSaptamana).toBeUndefined()
    expect(intrare.context).toMatchObject({ somnOre: undefined, apaLitri: undefined, alcoolPeSaptamana: undefined })
    expect(intrare.context?.motivatieMinima).toBeUndefined()
  })

  it("reproduce studiul de caz: RMB, menținere, țintă, macronutrienți, apă și ritm", () => {
    const rez = calculat(calcul(exemplu, VARIANTA_A))
    expect(r(rez.rmb.valoare, 1)).toBe(1583.2)
    expect(rez.activitate).toMatchObject({ coef: 1.375, sursa: "autoapreciere" })
    expect(r(rez.mentinereKcal, 1)).toBe(2176.9)
    expect(r(rez.tintaKcal, 1)).toBe(1676.9)
    expect(rez.deficitAplicat).toBe(true)
    expect(r(rez.macro!.proteineG, 1)).toBe(101.4)
    expect(r(rez.macro!.grasimiG, 2)).toBe(76.05)
    expect(r(rez.macro!.carbohidratiG, 1)).toBe(146.7)
    expect(rez.planPosibil).toBe(true)
    expect(rez.apa.minMl).toBeGreaterThan(0)
    expect(rez.ritm).not.toBeNull()
    expect(rez.tinteMeseKcal).toHaveLength(5)
  })

  it("și cu alegerile implicite: aceeași țintă, grăsimi 56 g, carbohidrați 192 g", () => {
    const rez = calculat(calcul(exemplu))
    expect(r(rez.tintaKcal, 1)).toBe(1676.9)
    expect(r(rez.macro!.grasimiG)).toBe(56)
    expect(r(rez.macro!.carbohidratiG)).toBe(192)
  })

  it("coeficientul vine din autoapreciere, după config, și este marcat „de confirmat”", () => {
    const asteptat: Record<Autoapreciere, number> = {
      pasiv: 1.2,
      usor: 1.375,
      mediu: 1.465,
      activ: 1.55,
      foarte_activ: 1.725,
    }
    for (const [nivel, coef] of Object.entries(asteptat)) {
      const rez = calculat(calcul({ ...exemplu, activitate_auto: nivel }))
      expect(rez.activitate.coef, nivel).toBe(coef)
      expect(rez.activitate.sursa).toBe("autoapreciere")
      expect(rez.semnale.map((s) => s.cod)).toContain("coeficient_neconfirmat")
    }
    // varianta A păstrează 1,75 la nivelul cel mai înalt
    expect(calculat(calcul({ ...exemplu, activitate_auto: "foarte_activ" }, VARIANTA_A)).activitate.coef).toBe(1.75)
    // maparea se schimbă din config, fără cod
    const prudent: ConfigEvaluare = {
      ...cfg,
      metoda: { ...cfg.metoda, coeficientDinAutoapreciere: { ...cfg.metoda.coeficientDinAutoapreciere, mediu: "usor" } },
    }
    expect(calculat(calcul({ ...exemplu, activitate_auto: "mediu" }, prudent)).activitate.coef).toBe(1.375)
  })

  it("fără `doarAutoapreciere`, regula din orarul antrenamentelor rămâne neschimbată", () => {
    expect(propuneCoeficient({ autoapreciere: "activ", antrenamente: [] }, VARIANTA_B.metoda)).toMatchObject({
      coef: 1.2,
      dinAutoapreciere: false,
    })
  })

  it("afecțiunile, tratamentul și alergiile devin semnale pentru Mariana", () => {
    const rez = calculat(
      calcul({
        ...exemplu,
        afectiuni: ["diabet", "tiroida"],
        insulina: "nu",
        tratament_permanent: "da",
        alergii_alimentare: "da",
        alimente_evitate: "lactoză",
      }),
    )
    const semnale = Object.fromEntries(rez.semnale.map((s) => [s.cod, s.mesaj]))
    expect(semnale.boala_cronica).toBe("Afecțiuni declarate: diabet, o boală a tiroidei.")
    expect(semnale).toHaveProperty("tratament")
    expect(semnale).toHaveProperty("alergie")
    // „niciuna” nu produce semnal
    expect(calculat(calcul(exemplu)).semnale.map((s) => s.cod)).not.toContain("boala_cronica")
  })

  it("merge și la protecții: prag minim și IMC sub 25 cu scop de slăbire", () => {
    const prag = calculat(calcul({ ...exemplu, varsta: "60", inaltime: "155", greutate: "68", activitate_auto: "pasiv" }))
    expect(prag.tintaKcal).toBe(1200)
    expect(prag.pragMinimAtins).toBe(true)
    const normopondere = calculat(calcul({ ...exemplu, greutate: "66,5" }))
    expect(normopondere.deficitAplicat).toBe(false)
    expect(normopondere.semnale.map((s) => s.cod)).toContain("imc_sub_25_slabire")
  })

  it("fișa listează răspunsurile cu formulările interviului scurt", () => {
    const randuri = randuriFisa(exemplu, cfg)
    const rand = (id: string) => randuri.find((x) => x.id === id)
    expect(randuri).toHaveLength(23)
    expect(rand("varsta")?.raspuns).toBe("30 ani")
    expect(rand("afectiuni")?.raspuns).toBe("Niciuna dintre acestea")
    expect(rand("activitate_auto")?.raspuns).toBe("Mișcare ușoară (de 1–3 ori pe săptămână)")
    expect(rand("mese_pe_zi")?.intrebare).toBe("Câte mese aveți de obicei pe zi?")
    expect(rand("mesaj")?.raspuns).toBe("—")
    expect(rand("insulina")).toBeUndefined()
  })
})

describe("rezumatul pentru clientă în interviul scurt", () => {
  const variante: Raspunsuri[] = [
    exemplu,
    { ...exemplu, activitate_auto: "activ" },
    { ...exemplu, omite_mese: "da", mananca_noaptea: "da", afectiuni: ["tiroida"] },
    { ...exemplu, mese_pe_zi: "2", activitate_auto: "pasiv" },
    {},
  ]

  it("are 3–4 observații, fără nicio cifră", () => {
    for (const rasp of variante) {
      const rezumat = construiesteRezumat(rasp, cfg)
      expect(rezumat.length).toBeGreaterThanOrEqual(3)
      expect(rezumat.length).toBeLessThanOrEqual(4)
      expect(rezumat.join(" ")).not.toMatch(/\d/)
      expect(verificaRezumat(rezumat)).toEqual([])
    }
  })

  it("pornește de la ce a răspuns clienta și nu preia textul ei liber", () => {
    expect(construiesteRezumat(exemplu, cfg)[0]).toContain("ritm al meselor")
    expect(construiesteRezumat({ ...exemplu, activitate_auto: "activ" }, cfg)[0]).toContain("Mișcarea")
    const cuText = { ...exemplu, mesaj: "vreau 1200 kcal", nume: "Nume Inventat", alimente_evitate: "lactoză" }
    const tot = construiesteRezumat(cuText, cfg).join(" ")
    expect(tot).not.toContain("1200")
    expect(tot).not.toContain("Nume Inventat")
    expect(tot).not.toContain("lactoză")
  })
})
