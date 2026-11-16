import { describe, expect, it } from "vitest"
import { propuneCoeficient } from "../activitate"
import { VARIANTA_A, VARIANTA_B } from "../config"
import { varstaInAni } from "../formule"
import type { Antrenament, Intensitate } from "../tipuri"

const antr = (oriPeSaptamana: number, intensitate: Intensitate): Antrenament => ({
  tip: "test",
  oriPeSaptamana,
  intensitate,
})
const coef = (antrenamente: Antrenament[], metoda = VARIANTA_B.metoda) =>
  propuneCoeficient({ antrenamente }, metoda).coef

describe("propunerea coeficientului de activitate", () => {
  it("fără antrenamente sau „pasiv” → 1,2", () => {
    expect(coef([])).toBe(1.2)
    expect(propuneCoeficient(undefined, VARIANTA_B.metoda).coef).toBe(1.2)
    expect(propuneCoeficient({ autoapreciere: "pasiv", antrenamente: [antr(5, "intensa")] }, VARIANTA_B.metoda).coef).toBe(1.2)
  })

  it("după totalul antrenamentelor", () => {
    expect(coef([antr(1, "usoara")])).toBe(1.375)
    expect(coef([antr(3, "moderata")])).toBe(1.375)
    expect(coef([antr(4, "moderata")])).toBe(1.465)
    expect(coef([antr(2, "usoara"), antr(3, "moderata")])).toBe(1.465)
    expect(coef([antr(7, "usoara")])).toBe(1.55)
    expect(coef([antr(7, "moderata"), antr(3, "usoara")])).toBe(1.9)
  })

  it("3 antrenamente: moderate → 1,375; intense → 1,55 (întrebarea 6)", () => {
    expect(coef([antr(3, "moderata")])).toBe(1.375)
    expect(coef([antr(3, "intensa")])).toBe(1.55)
  })

  it("antrenamentele intense ridică propunerea, nu o coboară", () => {
    expect(coef([antr(2, "intensa")])).toBe(1.375)
    expect(coef([antr(5, "intensa")])).toBe(1.55)
    expect(coef([antr(2, "moderata"), antr(3, "intensa")])).toBe(1.55)
  })

  it("6–7 intense: 1,725 în B și 1,75 în A", () => {
    expect(coef([antr(6, "intensa")], VARIANTA_B.metoda)).toBe(1.725)
    expect(coef([antr(6, "intensa")], VARIANTA_A.metoda)).toBe(1.75)
  })
})

describe("vârsta în ani împliniți", () => {
  const azi = new Date(2026, 10, 16)
  it("ține cont de ziua de naștere", () => {
    expect(varstaInAni("1996-11-16", azi)).toBe(30)
    expect(varstaInAni("1996-11-17", azi)).toBe(29)
    expect(varstaInAni("2008-11-17", azi)).toBe(17)
    expect(varstaInAni("2008-11-16", azi)).toBe(18)
  })
  it("respinge datele invalide", () => {
    expect(varstaInAni("1996-02-30", azi)).toBeNull()
    expect(varstaInAni("ieri", azi)).toBeNull()
  })
})
