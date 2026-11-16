// Ce face serverul cu o cerere de trimitere (fără rețea): acord, capcană anti-spam, validare
// repetată, opriri de siguranță și fișa compusă ca text. Datele sunt cele anonime din plan.md.

import { describe, expect, it } from "vitest"
import { CONFIG_IMPLICIT, cuVariantaInterviu, type ConfigEvaluare } from "../config"
import { raspunsuriExemplu, raspunsuriExempluScurt } from "../interviu/exemplu"
import type { Raspunsuri } from "../interviu/raspunsuri"
import { curataRaspunsuri, proceseazaCerere, type RezultatCerere } from "../trimitere/cerere"
import { compuneEmailContact, prenumeDinNume, type Email } from "../trimitere/fisa-email"

const AZI = new Date(Date.UTC(2026, 10, 16, 12, 5))
const cfg = CONFIG_IMPLICIT
const exemplu = raspunsuriExempluScurt()
const cerere = (raspunsuri: Raspunsuri, extra: Record<string, unknown> = {}) => ({
  tip: "evaluare",
  consimtamant: true,
  raspunsuri,
  website: "",
  ...extra,
})
const proceseaza = (corp: unknown, config: ConfigEvaluare = cfg) => proceseazaCerere(corp, config, AZI)
function email(rez: RezultatCerere): Email {
  if (rez.stare !== "trimite") throw new Error(`Așteptam un email, am primit: ${JSON.stringify(rez)}`)
  return rez.email
}

describe("acordul și forma cererii", () => {
  it("refuză fără consimțământ, oricum ar lipsi el", () => {
    for (const consimtamant of [false, undefined, null, "true", 1, "da"]) {
      expect(proceseaza(cerere(exemplu, { consimtamant }))).toEqual({
        stare: "refuz",
        status: 403,
        cod: "fara_consimtamant",
      })
    }
    const { consimtamant: _fara, ...faraCamp } = cerere(exemplu)
    expect(proceseaza(faraCamp)).toMatchObject({ stare: "refuz", cod: "fara_consimtamant" })
    // și cererea de contact de după o oprire cere acordul
    expect(proceseaza({ tip: "contact", consimtamant: false, nume: "Clientă de test", contact: "000 000 000" })).toMatchObject(
      { stare: "refuz", cod: "fara_consimtamant" },
    )
  })

  it("refuză cererile fără formă", () => {
    for (const corp of [null, "text", 42, [], {}, { tip: "altceva", consimtamant: true }]) {
      expect(proceseaza(corp)).toMatchObject({ stare: "refuz", status: 400, cod: "cerere_invalida" })
    }
    expect(proceseaza({ tip: "evaluare", consimtamant: true })).toMatchObject({ cod: "raspunsuri_invalide" })
    expect(proceseaza(cerere([] as unknown as Raspunsuri))).toMatchObject({ cod: "raspunsuri_invalide" })
  })

  it("capcana anti-spam completată: nu se trimite nimic, fără eroare", () => {
    expect(proceseaza(cerere(exemplu, { website: "http://spam.example" }))).toEqual({ stare: "ignora" })
    expect(proceseaza({ tip: "contact", consimtamant: true, nume: "Robot", contact: "000 000 000", website: "x" })).toEqual({
      stare: "ignora",
    })
  })

  it("cu trimiterea oprită din config, serverul refuză orice", () => {
    const oprit: ConfigEvaluare = { ...cfg, interviu: { ...cfg.interviu, trimitereActiva: false } }
    expect(proceseaza(cerere(exemplu), oprit)).toMatchObject({ stare: "refuz", status: 503, cod: "trimitere_inactiva" })
  })
})

describe("validarea repetată pe server", () => {
  it("acceptă exemplul complet", () => {
    expect(proceseaza(cerere(exemplu)).stare).toBe("trimite")
  })

  it("respinge răspunsurile lipsă sau imposibile", () => {
    const invalide: Raspunsuri[] = [
      {},
      { ...exemplu, varsta: undefined },
      { ...exemplu, inaltime: "17" },
      { ...exemplu, greutate: "abc" },
      { ...exemplu, sex: "X" },
      { ...exemplu, afectiuni: [] },
      { ...exemplu, afectiuni: ["niciuna", "diabet"], insulina: "nu" },
      { ...exemplu, afectiuni: ["diabet"] }, // lipsește răspunsul despre insulină
      { ...exemplu, scoff_4: undefined },
      { ...exemplu, activitate_auto: "campion" },
      { ...exemplu, contact: "sunați-mă" },
      { ...exemplu, nume: "" },
    ]
    for (const rasp of invalide) {
      expect(proceseaza(cerere(rasp)), JSON.stringify(rasp)).toMatchObject({ stare: "refuz", cod: "raspunsuri_invalide" })
    }
  })

  it("respinge valorile cu altă formă decât cea trimisă de interfață", () => {
    const brute: Record<string, unknown>[] = [
      { ...exemplu, varsta: 30 },
      { ...exemplu, nume: { $gt: "" } },
      { ...exemplu, afectiuni: "niciuna" },
      { ...exemplu, afectiuni: [1, 2] },
      { ...exemplu, sex: ["F"] },
      { ...exemplu, mesaj: "a".repeat(5000) },
      { ...exemplu, nume: "a".repeat(500) },
    ]
    for (const rasp of brute) {
      expect(curataRaspunsuri(rasp, cfg), JSON.stringify(rasp).slice(0, 80)).toBeNull()
      expect(proceseaza(cerere(rasp as Raspunsuri))).toMatchObject({ stare: "refuz", cod: "raspunsuri_invalide" })
    }
  })

  it("ignoră câmpurile necunoscute și curăță caracterele de control", () => {
    const curate = curataRaspunsuri(
      { ...exemplu, admin: "da", carne: "da", nume: "  Clientă\r\nde\ttest\u0000 ", mesaj: "rândul 1\r\nrândul 2\u0007" },
      cfg,
    )!
    expect(curate).not.toHaveProperty("admin")
    expect(curate).not.toHaveProperty("carne") // câmp din interviul complet
    expect(curate.nume).toBe("Clientă de test")
    expect(curate.mesaj).toBe("rândul 1\nrândul 2")
  })
})

describe("nimic nu se trimite când e oprire", () => {
  const cazuri: [string, Raspunsuri][] = [
    ["minor", { ...exemplu, varsta: "17" }],
    ["sarcina_alaptare", { ...exemplu, sarcina_alaptare: "da" }],
    ["insulina", { ...exemplu, afectiuni: ["diabet"], insulina: "da" }],
    ["imc_sub_18_5", { ...exemplu, greutate: "53" }],
    ["tulburari_alimentare", { ...exemplu, scoff_2: "da", scoff_5: "da" }],
  ]

  it.each(cazuri)("%s: refuz cu tipul opririi, fără email", (tip, rasp) => {
    const rez = proceseaza(cerere(rasp))
    expect(rez).toEqual({ stare: "refuz", status: 422, cod: "oprire", oprire: tip })
    expect(rez).not.toHaveProperty("email")
  })

  it("și când interviul s-a oprit devreme, cu răspunsuri incomplete", () => {
    expect(proceseaza(cerere({ varsta: "16" }))).toMatchObject({ cod: "oprire", oprire: "minor" })
    expect(proceseaza(cerere({ varsta: "30", sex: "F", sarcina_alaptare: "da" }))).toMatchObject({
      cod: "oprire",
      oprire: "sarcina_alaptare",
    })
  })

  it("după oprire pot pleca doar numele și contactul, fără niciun răspuns medical", () => {
    const rez = proceseaza({
      tip: "contact",
      consimtamant: true,
      nume: "Clientă de test",
      contact: "000 000 000",
      website: "",
      // un client modificat care ar încerca să strecoare răspunsurile
      raspunsuri: { ...exemplu, sarcina_alaptare: "da" },
      oprire: "sarcina_alaptare",
    })
    const mesaj = email(rez)
    expect(mesaj.subiect).toBe("Cerere de contact - Clientă")
    expect(mesaj.text).toContain("Nume: Clientă de test")
    expect(mesaj.text).toContain("Contact: 000 000 000")
    expect(mesaj.text).toContain("nu au fost trimise")
    expect(mesaj.text).not.toMatch(/sarcin|alăpt|insulin|diabet|IMC|kg|kcal|SCOFF|vârst/i)
    expect(mesaj.text.split("\n").filter((l) => l.includes(": "))).toHaveLength(3) // Primită, Nume, Contact
  })

  it("cererea de contact are nevoie de un nume și de un contact valid", () => {
    const cu = (nume: unknown, contact: unknown) => proceseaza({ tip: "contact", consimtamant: true, nume, contact })
    expect(cu("Clientă de test", "cineva@example.com").stare).toBe("trimite")
    expect(cu("", "000 000 000")).toMatchObject({ cod: "contact_invalid" })
    expect(cu("Clientă de test", "sunați-mă")).toMatchObject({ cod: "contact_invalid" })
    expect(cu("Clientă de test", "0".repeat(500))).toMatchObject({ cod: "contact_invalid" })
    expect(cu(undefined, 123)).toMatchObject({ cod: "cerere_invalida" })
  })
})

describe("fișa din email", () => {
  const mesaj = email(proceseaza(cerere({ ...exemplu, mesaj: "Prefer dimineața.\nMulțumesc!" })))

  it("subiectul conține doar prenumele, fără date medicale", () => {
    expect(mesaj.subiect).toBe("Evaluare nouă - Clientă")
    const cuInjectare = email(proceseaza(cerere({ ...exemplu, nume: "Ana-Maria Test\r\nBcc: cineva@example.com" })))
    expect(cuInjectare.subiect).toBe("Evaluare nouă - Ana-Maria")
    expect(prenumeDinNume("  ")).toBe("fără nume")
    expect(prenumeDinNume("84,5 kg diabet")).toBe("kg")
    expect(prenumeDinNume("a".repeat(100))).toHaveLength(40)
  })

  it("are cele patru părți, în ordine", () => {
    const pozitii = ["1. DATE DE BAZĂ", "2. SEMNALE DE ATENȚIE", "3. CALCUL", "4. RĂSPUNSURI"].map((t) =>
      mesaj.text.indexOf(t),
    )
    expect(pozitii.every((p) => p > 0)).toBe(true)
    expect([...pozitii].sort((a, b) => a - b)).toEqual(pozitii)
    expect(mesaj.text).toContain("Primită: 16 noiembrie 2026")
    expect(mesaj.text).toContain("Consimțământ: acordat")
    expect(mesaj.text).toContain("Nu este salvată pe site.")
  })

  it("datele de bază și mesajul pe mai multe rânduri", () => {
    for (const rand of [
      "Nume: Clientă de test",
      "Contact: 000 000 000",
      "Vârstă: 30 ani",
      "Sex: Femeie",
      "Înălțime: 170 cm",
      "Greutate: 84,5 kg",
      "Scop: Să slăbesc, Să am mai multă energie",
      "Mesaj: Prefer dimineața.\n    Mulțumesc!",
    ]) {
      expect(mesaj.text).toContain(rand)
    }
  })

  it("calculul complet, cu valorile implicite marcate „de confirmat la consultație”", () => {
    expect(mesaj.text).toContain("IMC: 29,2 (suprapondere)")
    expect(mesaj.text).toMatch(/RMB \(B1\): 1583 kcal/)
    expect(mesaj.text).toContain("Menținere: 2177 kcal")
    expect(mesaj.text).toContain("Țintă: 1677 kcal (cu deficit)")
    expect(mesaj.text).toContain("Proteine: 101 g")
    expect(mesaj.text).toContain("DE CONFIRMAT LA CONSULTAȚIE")
    expect(mesaj.text).toContain("- Coeficient de activitate 1,375 (din autoapreciere: „mișcare ușoară”, fără orarul antrenamentelor).")
    expect(mesaj.text).toContain("- Procent de grăsime corporală: estimat din IMC și vârstă (Deurenberg)")
    expect(mesaj.text).toContain("Neîntrebat în interviul scurt, de discutat la consultație: ocupația")
  })

  it("semnalele: cele de atenție înaintea celor informative", () => {
    const cuSemnale = email(
      proceseaza(
        cerere({
          ...exemplu,
          afectiuni: ["diabet", "inima_tensiune"],
          insulina: "nu",
          tratament_permanent: "da",
          alergii_alimentare: "da",
          alimente_evitate: "intoleranță la lactoză",
        }),
      ),
    ).text
    expect(cuSemnale).toContain("[ATENȚIE] Afecțiuni declarate: diabet, o boală de inimă sau tensiune arterială.")
    expect(cuSemnale).toContain("[ATENȚIE] Tratament medicamentos în curs.")
    expect(cuSemnale).toContain("[ATENȚIE] Alergii declarate.")
    expect(cuSemnale.lastIndexOf("[ATENȚIE]")).toBeLessThan(cuSemnale.indexOf("[informativ]"))
    expect(cuSemnale).toContain("- Urmați tratament cu insulină?: Nu")
    expect(cuSemnale).toContain("(opțional): intoleranță la lactoză")
  })

  it("răspunsurile apar toate, grupate pe blocuri; numele și contactul doar la datele de bază", () => {
    const raspunsuri = mesaj.text.slice(mesaj.text.indexOf("4. RĂSPUNSURI"))
    expect(raspunsuri).toContain("[Să ne cunoaștem]\n- Ce vârstă aveți?: 30 ani")
    expect(raspunsuri).toContain("[Relația cu mâncarea]")
    expect(raspunsuri.match(/^- /gm)).toHaveLength(21)
    expect(raspunsuri).not.toContain("000 000 000")
  })

  it("emailul de contact nu depinde de răspunsuri", () => {
    const contact = compuneEmailContact({ nume: "Clientă de test", contact: "cineva@example.com" }, AZI)
    expect(contact.subiect).toBe("Cerere de contact - Clientă")
    expect(contact.text).toContain("cineva@example.com")
  })
})

describe("interviul complet, reactivat din config, trimite la fel", () => {
  const complet = cuVariantaInterviu(cfg, "complet")
  const rasp = raspunsuriExemplu(new Date(2026, 10, 16))

  it("fișa conține și răspunsurile lungi, fără lista „neîntrebat”", () => {
    const mesaj = email(proceseaza(cerere(rasp), complet))
    expect(mesaj.subiect).toBe("Evaluare nouă - Clientă")
    expect(mesaj.text).toContain("Interviu: varianta completă")
    expect(mesaj.text).toContain("(data nașterii)")
    expect(mesaj.text).toContain("[Alimente]")
    expect(mesaj.text).not.toContain("Neîntrebat în interviul scurt")
  })

  it("opririle rămân aceleași", () => {
    expect(proceseaza(cerere({ ...rasp, boli_cronice: "da", diabet: "da", insulina: "da" }), complet)).toMatchObject({
      cod: "oprire",
      oprire: "insulina",
    })
  })
})
