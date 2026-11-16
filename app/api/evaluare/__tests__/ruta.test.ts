// Ruta POST /api/evaluare, de la cerere până la transport. nodemailer este înlocuit cu un
// martor: testele nu deschid nicio conexiune și nu trimit niciun email.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { TRIMITERE } from "@/lib/evaluare/config"
import { raspunsuriExempluScurt } from "@/lib/evaluare/interviu/exemplu"
import { reseteazaLimita } from "../limita"
import { POST } from "../route"
import { configSmtpDinEnv, trimiteEmail, variabileLipsa } from "../transport"

const smtp = vi.hoisted(() => ({
  sendMail: vi.fn(async (_mesaj: Record<string, unknown>) => ({ messageId: "test" })),
  close: vi.fn(),
  createTransport: vi.fn(),
}))
vi.mock("nodemailer", () => ({ createTransport: smtp.createTransport }))

// Valori inventate, doar pentru teste (domeniul rezervat example.com).
const MEDIU_SMTP = {
  EVALUARE_EMAIL_TO: "primire@example.com",
  EVALUARE_EMAIL_FROM: "expeditor@example.com",
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "465",
  SMTP_USER: "utilizator-de-test",
  SMTP_PASS: "parola-de-test",
}

const exemplu = raspunsuriExempluScurt()
const evaluare = (extra: Record<string, unknown> = {}) => ({
  tip: "evaluare",
  consimtamant: true,
  raspunsuri: exemplu,
  website: "",
  ...extra,
})

let ip = 0
function cere(corp: unknown, antete: Record<string, string> = {}) {
  ip += 1
  return POST(
    new Request("http://localhost/api/evaluare", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `198.51.100.${ip}`, ...antete },
      body: typeof corp === "string" ? corp : JSON.stringify(corp),
    }),
  )
}

function cuSmtp() {
  for (const [nume, valoare] of Object.entries(MEDIU_SMTP)) vi.stubEnv(nume, valoare)
}

beforeEach(() => {
  smtp.createTransport.mockImplementation(() => ({ sendMail: smtp.sendMail, close: smtp.close }))
  for (const nume of Object.keys(MEDIU_SMTP)) vi.stubEnv(nume, "")
  reseteazaLimita()
  ip = 0
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe("trimiterea fișei", () => {
  it("cu SMTP configurat: un singur email, la adresa din mediu, cu subiectul fără date medicale", async () => {
    cuSmtp()
    const raspuns = await cere(evaluare())
    expect(raspuns.status).toBe(200)
    expect(await raspuns.json()).toEqual({ ok: true })
    expect(raspuns.headers.get("cache-control")).toBe("no-store")

    expect(smtp.createTransport).toHaveBeenCalledTimes(1)
    expect(smtp.createTransport.mock.calls[0][0]).toMatchObject({
      host: "smtp.example.com",
      port: 465,
      secure: true,
      auth: { user: "utilizator-de-test", pass: "parola-de-test" },
    })
    expect(smtp.sendMail).toHaveBeenCalledTimes(1)
    const mesaj = smtp.sendMail.mock.calls[0][0]
    expect(Object.keys(mesaj).sort()).toEqual(["from", "subject", "text", "to"])
    expect(mesaj).toMatchObject({
      from: "expeditor@example.com",
      to: "primire@example.com",
      subject: "Evaluare nouă - Clientă",
    })
    expect(mesaj.text).toContain("3. CALCUL")
    expect(mesaj.text).toContain("Țintă: 1677 kcal")
    expect(smtp.close).toHaveBeenCalledTimes(1)
  })

  it("portul 587 folosește STARTTLS obligatoriu", async () => {
    cuSmtp()
    vi.stubEnv("SMTP_PORT", "587")
    await cere(evaluare())
    expect(smtp.createTransport.mock.calls[0][0]).toMatchObject({ port: 587, secure: false, requireTLS: true })
  })

  it("răspunsul către browser nu conține nicio cifră din fișă", async () => {
    cuSmtp()
    const text = await (await cere(evaluare())).text()
    expect(text).toBe('{"ok":true}')
  })

  it("nu scrie răspunsurile în jurnal", async () => {
    cuSmtp()
    const jurnale = (["log", "info", "warn", "error", "debug"] as const).map((nivel) =>
      vi.spyOn(console, nivel).mockImplementation(() => {}),
    )
    await cere(evaluare())
    smtp.sendMail.mockRejectedValueOnce(Object.assign(new Error("550 primire@example.com respins"), { code: "EENVELOPE" }))
    await cere(evaluare())
    const scris = jurnale.flatMap((j) => j.mock.calls.flat()).join(" ")
    expect(scris).toContain("EENVELOPE")
    expect(scris).not.toMatch(/Clientă|000 000 000|84,5|1677|example\.com/)
  })
})

describe("refuzuri: nu pleacă niciun email", () => {
  beforeEach(cuSmtp)
  afterEach(() => {
    expect(smtp.createTransport).not.toHaveBeenCalled()
    expect(smtp.sendMail).not.toHaveBeenCalled()
  })

  it("fără consimțământ", async () => {
    for (const consimtamant of [false, undefined, "true"]) {
      const raspuns = await cere(evaluare({ consimtamant }))
      expect(raspuns.status).toBe(403)
      expect(await raspuns.json()).toEqual({ ok: false, cod: "fara_consimtamant" })
    }
  })

  it("la orice oprire de siguranță", async () => {
    const opriri: [string, Record<string, unknown>][] = [
      ["minor", { varsta: "17" }],
      ["sarcina_alaptare", { sarcina_alaptare: "da" }],
      ["insulina", { afectiuni: ["diabet"], insulina: "da" }],
      ["imc_sub_18_5", { greutate: "53" }],
      ["tulburari_alimentare", { scoff_1: "da", scoff_2: "da" }],
    ]
    for (const [tip, schimbari] of opriri) {
      const raspuns = await cere(evaluare({ raspunsuri: { ...exemplu, ...schimbari } }))
      expect(raspuns.status, tip).toBe(422)
      expect(await raspuns.json()).toEqual({ ok: false, cod: "oprire", oprire: tip })
    }
  })

  it("cu răspunsuri invalide sau cu un corp care nu este JSON", async () => {
    expect((await cere(evaluare({ raspunsuri: { ...exemplu, inaltime: "5" } }))).status).toBe(422)
    const stricat = await cere("{nu e json")
    expect(stricat.status).toBe(400)
    expect(await stricat.json()).toEqual({ ok: false, cod: "cerere_invalida" })
  })

  it("cu o cerere prea mare", async () => {
    const raspuns = await cere(evaluare({ umplutura: "x".repeat(TRIMITERE.maxCaractereCerere) }))
    expect(raspuns.status).toBe(413)
  })

  it("cu capcana anti-spam completată: răspuns de succes, dar fără email", async () => {
    const raspuns = await cere(evaluare({ website: "http://spam.example" }))
    expect(raspuns.status).toBe(200)
    expect(await raspuns.json()).toEqual({ ok: true })
  })
})

describe("după o oprire: doar numele și contactul", () => {
  it("emailul de contact nu conține răspunsurile medicale", async () => {
    cuSmtp()
    const raspuns = await cere({
      tip: "contact",
      consimtamant: true,
      nume: "Clientă de test",
      contact: "000 000 000",
      website: "",
      raspunsuri: { ...exemplu, sarcina_alaptare: "da" },
    })
    expect(raspuns.status).toBe(200)
    expect(smtp.sendMail).toHaveBeenCalledTimes(1)
    const mesaj = smtp.sendMail.mock.calls[0][0]
    expect(mesaj.subject).toBe("Cerere de contact - Clientă")
    expect(mesaj.text).toContain("Contact: 000 000 000")
    expect(mesaj.text).not.toMatch(/sarcin|84,5|170 cm|kcal|IMC/i)
  })
})

describe("limita pe adresă IP", () => {
  it("după numărul permis de cereri răspunde 429, apoi alte adrese trec în continuare", async () => {
    const antete = { "x-forwarded-for": "203.0.113.7" }
    for (let i = 0; i < TRIMITERE.maxCereriPeIp; i++) {
      expect((await cere(evaluare(), antete)).status).toBe(200)
    }
    const blocat = await cere(evaluare(), antete)
    expect(blocat.status).toBe(429)
    expect(await blocat.json()).toEqual({ ok: false, cod: "prea_multe_cereri" })
    expect((await cere(evaluare(), { "x-forwarded-for": "203.0.113.8" })).status).toBe(200)
    // x-real-ip are prioritate
    expect((await cere(evaluare(), { ...antete, "x-real-ip": "203.0.113.9" })).status).toBe(200)
  })
})

describe("fără variabilele SMTP", () => {
  it("în dezvoltare și în teste: transport fals, nu se trimite nimic", async () => {
    const raspuns = await cere(evaluare())
    expect(raspuns.status).toBe(200)
    expect(smtp.createTransport).not.toHaveBeenCalled()
    expect(await trimiteEmail({ subiect: "s", text: "t" }, { NODE_ENV: "development" })).toEqual({
      ok: true,
      transport: "fals",
    })
  })

  it("în producție: eroare explicită, cu numele variabilelor lipsă în jurnal (fără valori)", async () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("SMTP_HOST", "smtp.example.com")
    const jurnal = vi.spyOn(console, "error").mockImplementation(() => {})
    const raspuns = await cere(evaluare())
    expect(raspuns.status).toBe(503)
    expect(await raspuns.json()).toEqual({ ok: false, cod: "trimitere_neconfigurata" })
    expect(smtp.createTransport).not.toHaveBeenCalled()
    const scris = jurnal.mock.calls.flat().join(" ")
    expect(scris).toContain("SMTP_PASS")
    expect(scris).not.toContain("smtp.example.com")
  })

  it("configurarea este completă doar cu toate cele șase variabile și un port valid", () => {
    expect(configSmtpDinEnv(MEDIU_SMTP)).toMatchObject({ host: "smtp.example.com", port: 465 })
    expect(variabileLipsa({})).toHaveLength(6)
    expect(variabileLipsa({ ...MEDIU_SMTP, SMTP_PASS: "" })).toEqual(["SMTP_PASS"])
    expect(configSmtpDinEnv({ ...MEDIU_SMTP, SMTP_PORT: "abc" })).toBeNull()
    expect(configSmtpDinEnv({ ...MEDIU_SMTP, EVALUARE_EMAIL_TO: " " })).toBeNull()
  })
})

describe("când serverul de email refuză", () => {
  it("răspunde cu eroare, ca formularul să rămână completat", async () => {
    cuSmtp()
    vi.spyOn(console, "error").mockImplementation(() => {})
    smtp.sendMail.mockRejectedValueOnce(Object.assign(new Error("conexiune refuzată"), { code: "ECONNECTION" }))
    const raspuns = await cere(evaluare())
    expect(raspuns.status).toBe(502)
    expect(await raspuns.json()).toEqual({ ok: false, cod: "trimitere_esuata" })
    expect(smtp.close).toHaveBeenCalledTimes(1)
  })
})
