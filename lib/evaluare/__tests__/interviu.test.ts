// Interviul complet (plan.md §3). Este dezactivat implicit din config (`interviu.varianta`);
// testele îl pornesc explicit, ca să rămână gata de reactivat. Interviul scurt: interviu-scurt.test.ts.

import { describe, expect, it } from "vitest"
import { rotunjit as r } from "../afisare"
import { calculeazaFisa } from "../calcul"
import { CONFIG_IMPLICIT, VARIANTA_A, cuVariantaInterviu, type ConfigEvaluare } from "../config"
import { raspunsuriExemplu } from "../interviu/exemplu"
import {
  campuriVizibile,
  eroriPas,
  oprireDinRaspunsuri,
  pasiVizibili,
  progres,
  raspunsuriActive,
} from "../interviu/graf"
import { PASI_COMPLET as PASI, pasiInterviu, type Pas } from "../interviu/intrebari"
import { construiesteIntrare, oreDeSomn, randuriFisa } from "../interviu/mapare"
import type { Raspunsuri } from "../interviu/raspunsuri"
import { construiesteRezumat, verificaRezumat } from "../interviu/rezumat"
import { CAMPURI, OPRIRI, OPTIUNI, UI } from "../interviu/texte"

const AZI = new Date(2026, 10, 16)
const cfg = cuVariantaInterviu(CONFIG_IMPLICIT, "complet")
const pas = (id: string): Pas => PASI.find((p) => p.id === id)!
const vizibile = (idPas: string, rasp: Raspunsuri, config = cfg) =>
  campuriVizibile(pas(idPas), rasp, config).map((c) => c.id)

describe("structura grafului", () => {
  it("varianta „complet” din config pornește chestionarul întreg", () => {
    expect(pasiInterviu(cfg)).toBe(PASI)
    expect(CONFIG_IMPLICIT.interviu.varianta).toBe("scurt")
    expect(pasiInterviu(CONFIG_IMPLICIT)).not.toBe(PASI)
  })

  it("fiecare câmp are o formulare și id-urile sunt unice", () => {
    const ids = PASI.flatMap((p) => p.campuri.map((c) => c.id))
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(CAMPURI[id]?.intrebare, id).toBeTruthy()
    expect(new Set(PASI.map((p) => p.id)).size).toBe(PASI.length)
  })

  it("câmpurile cu opțiuni indică un set existent", () => {
    for (const camp of PASI.flatMap((p) => p.campuri)) {
      if (["alegere", "alegere_multipla", "frecventa"].includes(camp.tip)) {
        expect(OPTIUNI[camp.optiuni!], camp.id).toBeTruthy()
      }
    }
  })

  it("acoperă cele 12 blocuri, în ordine", () => {
    const blocuri = [...new Set(PASI.map((p) => p.bloc))]
    expect(blocuri).toEqual([
      "baza",
      "general",
      "scop",
      "sanatate",
      "motivatie",
      "zi",
      "activitate",
      "lichide",
      "obiceiuri",
      "alimente",
      "relatie",
      "incheiere",
    ])
  })
})

describe("întrebări condiționale", () => {
  it("detaliile despre carne apar doar dacă a spus că mănâncă carne", () => {
    expect(vizibile("carne", {})).toEqual(["carne"])
    expect(vizibile("carne", { carne: "nu" })).toEqual(["carne"])
    expect(vizibile("carne", { carne: "da" })).toEqual(["carne", "carne_frecventa", "carne_detalii"])
  })

  it("sarcina se întreabă doar la femei", () => {
    expect(vizibile("sex", { sex: "B" })).toEqual(["sex"])
    expect(vizibile("sex", { sex: "F" })).toEqual(["sex", "sarcina_alaptare"])
  })

  it("boli cronice → sisteme și diabet; diabet → insulină", () => {
    expect(vizibile("boli_cronice", { boli_cronice: "nu" })).toEqual(["boli_cronice"])
    expect(vizibile("boli_cronice", { boli_cronice: "da" })).not.toContain("insulina")
    expect(vizibile("boli_cronice", { boli_cronice: "da", diabet: "da" })).toContain("insulina")
  })

  it("orarul activităților nu apare la „pasiv”; detaliile de alcool nu apar la „niciodată”", () => {
    expect(vizibile("activitate", { activitate_auto: "pasiv" })).toEqual(["activitate_auto"])
    expect(vizibile("activitate", { activitate_auto: "mediu" })).toContain("antrenamente")
    expect(vizibile("alcool", { alcool_frecventa: "niciodata" })).toEqual(["alcool_frecventa"])
    expect(vizibile("alcool", { alcool_frecventa: "rar" })).toContain("alcool_detalii")
  })

  it("„ce legume nu consumați” se întreabă mereu; fructele uscate doar la fructe", () => {
    expect(vizibile("legume", { legume: "nu" })).toEqual(["legume", "legume_nu"])
    expect(vizibile("fructe", { fructe: "da", fructe_uscate: "da" })).toContain("fructe_uscate_detalii")
    expect(vizibile("fructe", { fructe: "nu", fructe_uscate: "da" })).toEqual(["fructe"])
  })

  it("comutatoarele din config: grupa sanguină (oprită implicit) și SCOFF", () => {
    expect(vizibile("ocupatie", {})).not.toContain("grupa_sanguina")
    const cuGrupa: ConfigEvaluare = { ...cfg, interviu: { ...cfg.interviu, grupaSanguinaActiva: true } }
    expect(vizibile("ocupatie", {}, cuGrupa)).toContain("grupa_sanguina")

    expect(pasiVizibili({}, cfg).map((p) => p.id)).toContain("scoff")
    const faraScoff: ConfigEvaluare = { ...cfg, interviu: { ...cfg.interviu, scoffActiv: false } }
    expect(pasiVizibili({}, faraScoff).map((p) => p.id)).not.toContain("scoff")
  })

  it("răspunsurile la câmpuri dispărute nu ajung în fișă", () => {
    const active = raspunsuriActive({ carne: "nu", carne_detalii: "pui", sex: "B", sarcina_alaptare: "da" }, cfg)
    expect(active).toEqual({ carne: "nu", sex: "B" })
    expect(oprireDinRaspunsuri({ sex: "B", sarcina_alaptare: "da" }, cfg, AZI)).toBeNull()
  })
})

describe("validare", () => {
  it("cere răspunsurile obligatorii, dar nu și pe cele opționale", () => {
    expect(eroriPas(pas("carne"), {}, cfg, AZI)).toHaveProperty("carne")
    expect(eroriPas(pas("carne"), { carne: "nu" }, cfg, AZI)).toEqual({})
    expect(eroriPas(pas("carne"), { carne: "da" }, cfg, AZI)).toHaveProperty("carne_detalii")
    expect(eroriPas(pas("ocupatie"), { ocupatie: "birou" }, cfg, AZI)).toEqual({})
  })

  it("acceptă virgula zecimală și verifică intervalele", () => {
    expect(eroriPas(pas("corp"), { inaltime: "170", greutate: "84,5" }, cfg, AZI)).toEqual({})
    expect(eroriPas(pas("corp"), { inaltime: "1,70", greutate: "84.5" }, cfg, AZI)).toHaveProperty("inaltime")
    expect(eroriPas(pas("corp"), { inaltime: "abc", greutate: "70" }, cfg, AZI)).toHaveProperty("inaltime")
  })

  it("respinge datele de naștere imposibile", () => {
    expect(eroriPas(pas("data_nasterii"), { data_nasterii: "2030-01-01" }, cfg, AZI)).toHaveProperty("data_nasterii")
    expect(eroriPas(pas("data_nasterii"), { data_nasterii: "1990-02-31" }, cfg, AZI)).toHaveProperty("data_nasterii")
    expect(eroriPas(pas("data_nasterii"), { data_nasterii: "1990-02-28" }, cfg, AZI)).toEqual({})
  })

  it("un rând de activitate început trebuie completat", () => {
    const baza = { activitate_auto: "mediu" }
    const incomplet = { ...baza, antrenamente: [{ tip: "înot", ori: "", durata: "", intensitate: "" as const }] }
    const complet = { ...baza, antrenamente: [{ tip: "înot", ori: "2", durata: "", intensitate: "usoara" as const }] }
    const gol = { ...baza, antrenamente: [{ tip: "", ori: "", durata: "", intensitate: "" as const }] }
    expect(eroriPas(pas("activitate"), incomplet, cfg, AZI)).toHaveProperty("antrenamente")
    expect(eroriPas(pas("activitate"), complet, cfg, AZI)).toEqual({})
    expect(eroriPas(pas("activitate"), gol, cfg, AZI)).toEqual({})
  })
})

describe("opriri în interviu", () => {
  const adult = { data_nasterii: "1996-01-01" }

  it("sub 18 ani se oprește la data nașterii", () => {
    expect(oprireDinRaspunsuri({ data_nasterii: "2009-06-01" }, cfg, AZI)?.tip).toBe("minor")
    expect(oprireDinRaspunsuri(adult, cfg, AZI)).toBeNull()
  })

  it("sarcină sau alăptare", () => {
    expect(oprireDinRaspunsuri({ ...adult, sex: "F", sarcina_alaptare: "da" }, cfg, AZI)?.tip).toBe("sarcina_alaptare")
    expect(oprireDinRaspunsuri({ ...adult, sex: "F", sarcina_alaptare: "nu" }, cfg, AZI)).toBeNull()
  })

  it("IMC sub 18,5", () => {
    const rasp = { ...adult, sex: "B", inaltime: "170", greutate: "53" }
    expect(oprireDinRaspunsuri(rasp, cfg, AZI)?.tip).toBe("imc_sub_18_5")
    expect(oprireDinRaspunsuri({ ...rasp, greutate: "54" }, cfg, AZI)).toBeNull()
  })

  it("diabet tratat cu insulină", () => {
    const rasp = { ...adult, boli_cronice: "da", diabet: "da", insulina: "da" }
    expect(oprireDinRaspunsuri(rasp, cfg, AZI)?.tip).toBe("insulina")
    expect(oprireDinRaspunsuri({ ...rasp, insulina: "nu" }, cfg, AZI)).toBeNull()
  })

  it("SCOFF: două răspunsuri „da” opresc, unul nu", () => {
    expect(oprireDinRaspunsuri({ ...adult, scoff_2: "da" }, cfg, AZI)).toBeNull()
    expect(oprireDinRaspunsuri({ ...adult, scoff_2: "da", scoff_5: "da" }, cfg, AZI)?.tip).toBe("tulburari_alimentare")
  })

  it("mesajele de oprire există pentru fiecare tip și nu conțin cifre despre clientă", () => {
    for (const tip of ["sarcina_alaptare", "insulina", "imc_sub_18_5", "tulburari_alimentare"] as const) {
      expect(OPRIRI[tip].paragrafe.join(" ")).not.toMatch(/\d/)
    }
    // La oprire răspunsurile nu pleacă nicăieri, deci mesajul nu promite că Mariana a primit ceva.
    expect(UI.oprireNetrimis).not.toMatch(/va primi/)
    expect(UI.oprireMinor).not.toMatch(/va primi/)
  })
})

describe("progres", () => {
  it("merge de la primul bloc la ultimul", () => {
    const rasp = raspunsuriExemplu(AZI)
    const ecrane = pasiVizibili(rasp, cfg).length + 1 // consimțământul este pasul 1
    const inceput = progres("data_nasterii", rasp, cfg)
    expect(inceput.indexBloc).toBe(0)
    expect(inceput.totalBlocuri).toBe(12)
    expect(inceput).toMatchObject({ pas: 2, totalPasi: ecrane })
    expect(inceput.procent).toBeLessThan(5)
    const sfarsit = progres("mirodenii", rasp, cfg)
    expect(sfarsit.indexBloc).toBe(11)
    expect(sfarsit.blocuri.filter((b) => b.stare === "terminat")).toHaveLength(11)
    expect(sfarsit.pas).toBe(ecrane)
    expect(sfarsit.procent).toBeGreaterThan(90)
    expect(sfarsit.procent).toBeLessThan(100)
  })
})

describe("de la răspunsuri la calcul", () => {
  const rasp = raspunsuriExemplu(AZI)

  it("exemplul este complet: niciun pas nu are erori și nu apare nicio oprire", () => {
    for (const p of pasiVizibili(rasp, cfg)) expect(eroriPas(p, rasp, cfg, AZI), p.id).toEqual({})
    expect(oprireDinRaspunsuri(rasp, cfg, AZI)).toBeNull()
  })

  it("construiește intrarea motorului", () => {
    const intrare = construiesteIntrare(rasp, cfg, { azi: AZI })!
    expect(intrare).toMatchObject({ sex: "F", varstaAni: 30, inaltimeCm: 170, greutateKg: 84.5, scopSlabire: true })
    expect(intrare.activitate?.antrenamente).toEqual([
      { tip: "mers pe jos", oriPeSaptamana: 3, durataMinute: 40, intensitate: "moderata" },
    ])
    expect(r(intrare.ritmDoritKgPeSaptamana!, 2)).toBe(0.77)
    expect(intrare.context).toMatchObject({ somnOre: 7.5, apaLitri: 1.5, alcoolPeSaptamana: 0.5, motivatieMinima: 7 })
  })

  it("reproduce studiul de caz: coeficient propus 1,375 și ținta din T1", () => {
    const variantaA = cuVariantaInterviu(VARIANTA_A, "complet")
    const rez = calculeazaFisa(construiesteIntrare(rasp, variantaA, { azi: AZI })!, variantaA)
    expect(rez.stare).toBe("calculat")
    if (rez.stare !== "calculat") return
    expect(rez.activitate).toMatchObject({ coef: 1.375, sursa: "propus" })
    expect(r(rez.tintaKcal, 1)).toBe(1676.9)
    // 10 kg în 3 luni depășește ce permite deficitul de 500 kcal
    expect(rez.semnale.map((s) => s.cod)).toContain("ritm_dorit")
  })

  it("întoarce null fără datele de bază", () => {
    expect(construiesteIntrare({ sex: "F" }, cfg, { azi: AZI })).toBeNull()
  })

  it("orele de somn trec corect peste miezul nopții", () => {
    expect(oreDeSomn("23:30", "07:00")).toBe(7.5)
    expect(oreDeSomn("01:00", "06:30")).toBe(5.5)
    expect(oreDeSomn("", "06:30")).toBeUndefined()
  })

  it("fișa listează întrebările vizibile cu răspunsuri formatate", () => {
    const randuri = randuriFisa(rasp, cfg)
    const raspuns = (id: string) => randuri.find((x) => x.id === id)?.raspuns
    expect(raspuns("greutate")).toBe("84,5 kg")
    expect(raspuns("carne_frecventa")).toBe("Foarte des (de 5–6 ori pe săptămână) [5,5/săpt.]")
    expect(raspuns("scopuri")).toBe("Să slăbesc, Să am mai multă energie")
    expect(raspuns("antrenamente")).toBe("mers pe jos: de 3 ori/săpt., 40 min, intensitate moderată")
    expect(raspuns("motivatie_schimbare")).toBe("8 din 10")
    expect(raspuns("sanatate_altele")).toBe("—")
    // boboase = „nu”, deci detaliile nu apar deloc în fișă
    expect(raspuns("boboase")).toBe("Nu")
    expect(raspuns("boboase_detalii")).toBeUndefined()
    expect(randuri.find((x) => x.id === "carne")?.bloc).toBe("Alimente")
  })
})

describe("rezumatul pentru clientă", () => {
  const variante: Raspunsuri[] = [
    raspunsuriExemplu(AZI),
    {},
    { ...raspunsuriExemplu(AZI), motivatie_schimbare: "3", ora_culcare: "02:00", apa_litri: "0,5", omite_mese: "da" },
    { ...raspunsuriExemplu(AZI), motivatie_schimbare: "5", legume_frecventa: "zilnic", boli_cronice: "da" },
  ]

  it("are 3–4 observații, fără nicio cifră, în toate variantele", () => {
    for (const rasp of variante) {
      const rezumat = construiesteRezumat(rasp, cfg)
      expect(rezumat.length).toBeGreaterThanOrEqual(3)
      expect(rezumat.length).toBeLessThanOrEqual(4)
      expect(rezumat.join(" ")).not.toMatch(/\d/)
      expect(verificaRezumat(rezumat)).toEqual([])
    }
  })

  it("nu preia textul liber al clientei", () => {
    const rasp = { ...raspunsuriExemplu(AZI), informatii: "vreau 1200 kcal", nume: "Nume Inventat" }
    const tot = construiesteRezumat(rasp, cfg).join(" ")
    expect(tot).not.toContain("1200")
    expect(tot).not.toContain("Nume Inventat")
  })

  it("verificarea respinge cifrele cu unități și cuvântul IMC", () => {
    const ok = ["Prima observație.", "A doua observație.", "A treia observație."]
    expect(verificaRezumat(ok)).toEqual([])
    expect(verificaRezumat([...ok.slice(0, 2), "Aveți nevoie de 1677 kcal."])).not.toEqual([])
    expect(verificaRezumat([...ok.slice(0, 2), "Puteți slăbi 5 kg."])).not.toEqual([])
    expect(verificaRezumat([...ok.slice(0, 2), "Grăsimile sunt 30 %."])).not.toEqual([])
    expect(verificaRezumat([...ok.slice(0, 2), "IMC-ul dumneavoastră este ridicat."])).not.toEqual([])
    expect(verificaRezumat(ok.slice(0, 2))).not.toEqual([])
  })
})
