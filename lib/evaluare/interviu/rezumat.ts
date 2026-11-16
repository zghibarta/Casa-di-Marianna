// Rezumatul pentru clientă: 3–4 observații, fără cifre, fără diagnostic, fără plan.
// Se construiește din șabloane fixe, niciodată din textul liber al clientei. Aceleași șabloane
// servesc ambele variante de interviu: o observație apare doar dacă întrebarea ei a fost pusă.
// În Faza 3 îl va scrie modelul, iar verificaRezumat() va respinge orice text cu cifre.

import type { ConfigEvaluare } from "../config"
import { frecventaPeSaptamana, raspunsuriActive } from "./graf"
import { oreDeSomn, antrenamenteDinRaspunsuri } from "./mapare"
import { esteDa, lista, numar, text, type Raspunsuri } from "./raspunsuri"

const FALLBACK_PUNCT_FORTE =
  "Ați răspuns cu răbdare la toate întrebările, iar asta o ajută mult pe Mariana să vă cunoască înainte de întâlnire."

const URMEAZA_TRIMIS =
  "Mariana vă va contacta pentru programare. La consultație pornește de la răspunsurile dumneavoastră și stabiliți împreună pașii următori."
// Cu trimiterea oprită din config nu promitem că Mariana a primit ceva.
const URMEAZA_NETRIMIS =
  "Urmează programarea. La consultație, Mariana pornește de la răspunsurile dumneavoastră și stabiliți împreună pașii următori."

const MISCARE_REGULATA = ["mediu", "activ", "foarte_activ"]

function punctForte(r: Raspunsuri): string {
  const motivatie = Math.min(numar(r, "motivatie_schimbare") ?? 0, numar(r, "motivatie_recomandari") ?? 0)
  if (motivatie >= 8) {
    return "Veniți cu multă dorință de schimbare, iar acesta este un punct de plecare foarte bun."
  }
  if ((frecventaPeSaptamana(r, "legume_frecventa") ?? 0) >= 5) {
    return "Legumele apar des în mesele dumneavoastră, iar acesta este un obicei valoros pe care se poate construi."
  }
  // Interviul scurt nu are orar de antrenamente: contează autoaprecierea.
  const faraOrar = r.antrenamente === undefined && MISCARE_REGULATA.includes(text(r, "activitate_auto"))
  if (antrenamenteDinRaspunsuri(r).length > 0 || faraOrar) {
    return "Mișcarea face deja parte din săptămâna dumneavoastră, iar acesta este un sprijin real pentru ce urmează."
  }
  const ritmComplet = text(r, "ora_fixa") === "da" && !esteDa(r, "omite_mese")
  const ritmScurt =
    r.ora_fixa === undefined &&
    (numar(r, "mese_pe_zi") ?? 0) >= 3 &&
    text(r, "omite_mese") === "nu" &&
    text(r, "mananca_noaptea") === "nu"
  if (ritmComplet || ritmScurt) {
    return "Aveți deja un ritm al meselor, iar acesta este un sprijin real pentru ce urmează."
  }
  return FALLBACK_PUNCT_FORTE
}

function deExplorat(r: Raspunsuri, config: ConfigEvaluare): string[] {
  const teme: string[] = []
  const somn = oreDeSomn(text(r, "ora_culcare"), text(r, "ora_trezire"))
  const somnDificil = ["adorm_greu", "treziri", "fara_energie"].includes(text(r, "somn"))
  if (somnDificil || (somn !== undefined && somn < config.semnale.somnMinimOre)) {
    teme.push("Somnul este un subiect despre care Mariana va dori să afle mai multe de la dumneavoastră.")
  }
  if (esteDa(r, "omite_mese") || esteDa(r, "mananca_noaptea") || text(r, "ora_fixa") === "nu") {
    teme.push("Veți privi împreună ritmul meselor de-a lungul zilei, așa cum se potrivește programului dumneavoastră.")
  }
  const apa = numar(r, "apa_litri")
  if (apa !== undefined && apa < config.semnale.apaMinimaLitri + 0.5) {
    teme.push("Veți vorbi și despre lichidele din timpul zilei.")
  }
  const sanatate =
    esteDa(r, "boli_cronice") ||
    esteDa(r, "tratament") ||
    esteDa(r, "alergii") ||
    lista(r, "afectiuni").some((x) => x !== "niciuna") ||
    esteDa(r, "tratament_permanent") ||
    esteDa(r, "alergii_alimentare")
  if (sanatate) {
    teme.push("Mariana va ține cont de ce ne-ați spus despre sănătatea dumneavoastră.")
  }
  if (teme.length === 0) {
    teme.push("La consultație veți discuta pe îndelete despre obiceiurile dumneavoastră și despre ce v-ați dori să schimbați.")
  }
  return teme.slice(0, 2)
}

/** 3–4 observații: un punct forte, 1–2 teme de explorat cu Mariana și ce urmează. */
export function construiesteRezumat(raspunsuri: Raspunsuri, config: ConfigEvaluare): string[] {
  const r = raspunsuriActive(raspunsuri, config)
  const urmeaza = config.interviu.trimitereActiva ? URMEAZA_TRIMIS : URMEAZA_NETRIMIS
  return [punctForte(r), ...deExplorat(r, config), urmeaza]
}

/**
 * Regula din plan.md §7: rezumatul nu conține cifre urmate de kcal, kg, g sau %, nici cuvântul „IMC”.
 * Întoarce lista problemelor; goală = rezumatul poate ajunge la clientă.
 */
export function verificaRezumat(observatii: string[]): string[] {
  const probleme: string[] = []
  const tot = observatii.join(" ")
  if (/\d+([.,]\d+)?\s*(kcal|calorii|kg|kilograme|g|grame|%|la sută)(?![\p{L}])/iu.test(tot)) {
    probleme.push("Conține cifre cu unități (kcal, kg, g sau %).")
  }
  if (/(?<![\p{L}])IMC(?![\p{L}])/iu.test(tot)) probleme.push("Conține cuvântul „IMC”.")
  if (observatii.length < 3 || observatii.length > 4) probleme.push("Trebuie să aibă 3–4 observații.")
  if (tot.split(/\s+/).filter(Boolean).length > 120) probleme.push("Depășește 120 de cuvinte.")
  return probleme
}
