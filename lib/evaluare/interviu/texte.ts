// Toate formulările interviului, într-un singur fișier, ca Mariana să le poată revizui.
// Forma de adresare este „dumneavoastră”, cu formulări neutre ca gen. O a doua formă („tu”)
// s-ar adăuga aici, ca al doilea set de texte, fără schimbări în graf.
//
// Reguli de ton: fără culpabilizare, fără „alimente interzise”, fără promisiuni de kilograme,
// fără nume de produse sau mărci.

import type { TipOprire } from "../tipuri"

export interface Optiune {
  valoare: string
  eticheta: string
}

export const BLOCURI = {
  baza: "Să ne cunoaștem",
  general: "Date generale",
  scop: "Scopul dumneavoastră",
  sanatate: "Sănătate",
  motivatie: "Motivație",
  zi: "Regimul zilei",
  activitate: "Mișcare",
  lichide: "Lichide",
  obiceiuri: "Obiceiuri de masă",
  alimente: "Alimente",
  relatie: "Relația cu mâncarea",
  incheiere: "Încheiere",
  // doar în interviul scurt
  alimentatie: "Alergii și preferințe",
  contact: "Date de contact",
} as const
export type IdBloc = keyof typeof BLOCURI

const DA_NU: Optiune[] = [
  { valoare: "da", eticheta: "Da" },
  { valoare: "nu", eticheta: "Nu" },
]

const FRECVENTA: Optiune[] = [
  { valoare: "zilnic", eticheta: "Zilnic" },
  { valoare: "foarte_des", eticheta: "Foarte des (de 5–6 ori pe săptămână)" },
  { valoare: "des", eticheta: "Des (de 3–4 ori pe săptămână)" },
  { valoare: "unu_doua", eticheta: "De 1–2 ori pe săptămână" },
  { valoare: "rar", eticheta: "Rar (mai puțin de o dată pe săptămână)" },
]

export const OPTIUNI = {
  da_nu: DA_NU,
  frecventa: FRECVENTA,
  frecventa_cu_niciodata: [...FRECVENTA, { valoare: "niciodata", eticheta: "Niciodată" }],
  sex: [
    { valoare: "F", eticheta: "Femeie" },
    { valoare: "B", eticheta: "Bărbat" },
  ],
  scopuri: [
    { valoare: "slabire", eticheta: "Să slăbesc" },
    { valoare: "alimentatie", eticheta: "Să învăț să mă alimentez echilibrat" },
    { valoare: "program", eticheta: "Să am un program al meselor" },
    { valoare: "energie", eticheta: "Să am mai multă energie" },
    { valoare: "altul", eticheta: "Altceva" },
  ],
  sisteme: [
    { valoare: "nervos", eticheta: "Sistemul nervos" },
    { valoare: "cardiovascular", eticheta: "Inima și vasele de sânge" },
    { valoare: "gastrointestinal", eticheta: "Sistemul digestiv" },
    { valoare: "endocrin", eticheta: "Sistemul endocrin (tiroidă, diabet și altele)" },
    { valoare: "respirator", eticheta: "Sistemul respirator" },
    { valoare: "urogenital", eticheta: "Sistemul urogenital" },
    { valoare: "locomotor", eticheta: "Oase, articulații și mușchi" },
  ],
  somn: [
    { valoare: "odihnitor", eticheta: "Odihnitor" },
    { valoare: "bun", eticheta: "De obicei bun" },
    { valoare: "adorm_greu", eticheta: "Adorm greu" },
    { valoare: "treziri", eticheta: "Mă trezesc în timpul nopții" },
    { valoare: "fara_energie", eticheta: "Mă trezesc fără energie" },
  ],
  autoapreciere: [
    { valoare: "foarte_activ", eticheta: "Foarte multă mișcare" },
    { valoare: "activ", eticheta: "Multă mișcare" },
    { valoare: "mediu", eticheta: "Mișcare moderată" },
    { valoare: "usor", eticheta: "Mișcare ușoară" },
    { valoare: "pasiv", eticheta: "Aproape deloc" },
  ],
  // Interviul scurt: aceleași niveluri, cu repere concrete, pentru că din acest răspuns se
  // propune coeficientul de activitate (reperele sunt cele din tabelul de coeficienți).
  autoapreciere_scurt: [
    { valoare: "pasiv", eticheta: "Aproape deloc (muncă de birou, fără mișcare regulată)" },
    { valoare: "usor", eticheta: "Mișcare ușoară (de 1–3 ori pe săptămână)" },
    { valoare: "mediu", eticheta: "Mișcare moderată (de 4–5 ori pe săptămână)" },
    { valoare: "activ", eticheta: "Multă mișcare (zilnic sau antrenamente intense de 3–4 ori pe săptămână)" },
    { valoare: "foarte_activ", eticheta: "Foarte multă mișcare (antrenamente intense aproape în fiecare zi)" },
  ],
  // Interviul scurt, ecranul de sănătate. „niciuna” nu se combină cu celelalte.
  afectiuni: [
    { valoare: "diabet", eticheta: "Diabet" },
    { valoare: "tiroida", eticheta: "O boală a tiroidei" },
    { valoare: "inima_tensiune", eticheta: "O boală de inimă sau tensiune arterială" },
    { valoare: "rinichi", eticheta: "O boală de rinichi" },
    { valoare: "digestiva", eticheta: "O boală digestivă" },
    { valoare: "alta", eticheta: "Altă problemă de sănătate" },
    { valoare: "niciuna", eticheta: "Niciuna dintre acestea" },
  ],
  intensitate: [
    { valoare: "usoara", eticheta: "Ușoară" },
    { valoare: "moderata", eticheta: "Moderată" },
    { valoare: "intensa", eticheta: "Intensă" },
  ],
  apa_cum: [
    { valoare: "treptat", eticheta: "Puțin câte puțin, pe parcursul zilei" },
    { valoare: "la_mese", eticheta: "Mai ales la mese" },
    { valoare: "la_sete", eticheta: "Mai ales când mi se face sete" },
    { valoare: "rar_mult", eticheta: "Cantități mari, de câteva ori pe zi" },
  ],
  ora_fixa: [
    { valoare: "da", eticheta: "Da" },
    { valoare: "de_obicei", eticheta: "De obicei" },
    { valoare: "nu", eticheta: "Nu" },
  ],
  prima_masa: [
    { valoare: "sub_30", eticheta: "În prima jumătate de oră" },
    { valoare: "30_60", eticheta: "Între 30 de minute și o oră" },
    { valoare: "1_2_ore", eticheta: "După 1–2 ore" },
    { valoare: "peste_2", eticheta: "După mai mult de 2 ore" },
  ],
  ultima_masa: [
    { valoare: "sub_1", eticheta: "Cu mai puțin de o oră" },
    { valoare: "1_2", eticheta: "Cu 1–2 ore" },
    { valoare: "2_3", eticheta: "Cu 2–3 ore" },
    { valoare: "peste_3", eticheta: "Cu mai mult de 3 ore" },
  ],
  masa_consistenta: [
    { valoare: "mic_dejun", eticheta: "Micul dejun" },
    { valoare: "pranz", eticheta: "Prânzul" },
    { valoare: "cina", eticheta: "Cina" },
    { valoare: "variaza", eticheta: "Diferă de la o zi la alta" },
  ],
  mese_principale: [
    { valoare: "mic_dejun", eticheta: "Micul dejun" },
    { valoare: "pranz", eticheta: "Prânzul" },
    { valoare: "cina", eticheta: "Cina" },
  ],
} satisfies Record<string, Optiune[]>
export type IdOptiuni = keyof typeof OPTIUNI

export interface TextCamp {
  intrebare: string
  ajutor?: string
  substituent?: string
}

const NIMIC_DE_JUDECAT = "Nu e nimic de judecat aici; ne interesează doar cum arată o săptămână obișnuită."

export const CAMPURI: Record<string, TextCamp> = {
  // ---- 1. Bază și siguranță ----
  data_nasterii: {
    intrebare: "Care este data dumneavoastră de naștere?",
    ajutor: "Vârsta intră în calculele pe care le va verifica terapeutul integrativ.",
  },
  sex: {
    intrebare: "Care este sexul dumneavoastră?",
    ajutor: "Formulele de calcul diferă la femei și la bărbați.",
  },
  sarcina_alaptare: { intrebare: "Sunteți însărcinată sau alăptați în această perioadă?" },
  inaltime: { intrebare: "Ce înălțime aveți?" },
  greutate: {
    intrebare: "Ce greutate aveți acum?",
    ajutor: "O valoare aproximativă este suficientă. Rămâne între dumneavoastră și terapeutul integrativ.",
  },

  // ---- 2. Date generale ----
  nume: { intrebare: "Cum vă numiți?", substituent: "Prenume și nume" },
  contact: {
    intrebare: "Cum vă poate contacta terapeutul integrativ?",
    ajutor: "Un număr de telefon sau o adresă de email.",
  },
  ocupatie: {
    intrebare: "Cu ce vă ocupați?",
    ajutor: "De exemplu: muncă de birou, lucru în picioare, muncă fizică, acasă cu copiii.",
  },
  greutate_maxima: { intrebare: "Care a fost cea mai mare greutate pe care ați avut-o ca adult? (opțional)" },
  greutate_minima: { intrebare: "Dar cea mai mică? (opțional)" },
  grupa_sanguina: { intrebare: "Ce grupă sanguină aveți? (opțional)" },

  // ---- 3. Scop ----
  scopuri: {
    intrebare: "Ce v-ați dori cel mai mult să se schimbe după consultațiile de la Casa di Marianna?",
    ajutor: "Puteți alege mai multe răspunsuri.",
  },
  scop_altul: { intrebare: "Ce anume v-ați dori?" },
  scop_slabire_kg: {
    intrebare: "Dacă aveți o cifră în minte: câte kilograme v-ați dori să slăbiți? (opțional)",
    ajutor: "Puteți lăsa liber. Veți stabili împreună cu terapeutul integrativ ce este potrivit pentru dumneavoastră.",
  },
  scop_slabire_luni: { intrebare: "Și în cât timp, aproximativ? (opțional)" },

  // ---- 4. Sănătate ----
  interventii: { intrebare: "Ați avut vreodată intervenții chirurgicale?" },
  interventii_detalii: { intrebare: "Ce intervenții și cam când?" },
  traume: { intrebare: "Ați avut traume sau accidente importante?" },
  traume_detalii: { intrebare: "Ne puteți spune pe scurt despre ele?" },
  alergii: { intrebare: "Aveți alergii sau intoleranțe?" },
  alergii_detalii: { intrebare: "La ce anume? Menționați, vă rugăm, și alimentele." },
  antecedente: {
    intrebare: "Există boli care se repetă în familia dumneavoastră?",
    ajutor: "De exemplu diabet, boli de inimă, boli ale tiroidei.",
  },
  antecedente_detalii: { intrebare: "Care anume și la cine din familie?" },
  boli_cronice: { intrebare: "Aveți o boală cronică sau o problemă de sănătate de durată?" },
  boli_sisteme: { intrebare: "Ce parte a organismului este afectată?", ajutor: "Puteți alege mai multe răspunsuri." },
  boli_detalii: { intrebare: "Ne puteți spune mai multe? De exemplu diagnosticul și de când îl aveți." },
  diabet: { intrebare: "Aveți diabet?" },
  insulina: { intrebare: "Urmați tratament cu insulină?" },
  tratament: { intrebare: "Luați medicamente în această perioadă?" },
  tratament_detalii: { intrebare: "Ce medicamente?" },
  suplimente: { intrebare: "Luați suplimente alimentare?" },
  suplimente_detalii: { intrebare: "Ce suplimente?" },
  fumat: { intrebare: "Fumați?" },
  sanatate_altele: { intrebare: "Mai este ceva legat de sănătate ce ar trebui să știe terapeutul integrativ? (opțional)" },

  // ---- 5. Motivație ----
  motivatie_schimbare: {
    intrebare: "Pe o scară de la 1 la 10, cât de mult vă doriți acum să schimbați ceva în felul în care trăiți?",
    ajutor: "Orice cifră este un răspuns bun.",
  },
  motivatie_recomandari: {
    intrebare: "Pe aceeași scară, câtă disponibilitate aveți acum să urmați recomandările pe care le veți primi?",
  },

  // ---- 6. Regimul zilei ----
  ora_trezire: { intrebare: "La ce oră vă treziți de obicei?" },
  ora_culcare: { intrebare: "La ce oră vă culcați de obicei?" },
  somn: { intrebare: "Cum este somnul dumneavoastră?" },
  somn_detalii: { intrebare: "Doriți să adăugați ceva despre somn? (opțional)" },

  // ---- 7. Activitate fizică ----
  activitate_auto: { intrebare: "Câtă mișcare faceți într-o săptămână obișnuită?" },
  antrenamente: {
    intrebare: "Ce activități fizice faceți?",
    ajutor:
      "De exemplu mers pe jos, sală, înot, dans, grădinărit. Dacă nu aveți activități regulate, puteți continua fără să completați.",
  },

  // ---- 8. Lichide și alcool ----
  apa_litri: { intrebare: "Câtă apă beți într-o zi obișnuită?", ajutor: "Un pahar are cam 0,25 l." },
  apa_cum: { intrebare: "Cum o beți de obicei?" },
  alte_bauturi: {
    intrebare: "Ce alte băuturi apar în ziua dumneavoastră?",
    ajutor: "De exemplu cafea, ceai, sucuri, compot. Dacă nu beți altceva, scrieți „doar apă”.",
  },
  alcool_frecventa: { intrebare: "Cât de des consumați băuturi alcoolice?" },
  alcool_detalii: { intrebare: "Ce băuturi și cam ce cantitate?" },

  // ---- 9. Obiceiuri de masă ----
  mananca_zilnic: { intrebare: "Mâncați în fiecare zi?" },
  mese_pe_zi: { intrebare: "Câte mese principale aveți pe zi?" },
  ora_fixa: { intrebare: "Mâncați la ore fixe?" },
  gustari: { intrebare: "Luați gustări între mese?" },
  gustari_detalii: { intrebare: "Câte și ce anume, de obicei?" },
  mananca_noaptea: { intrebare: "Vi se întâmplă să mâncați noaptea?" },
  noapte_frecventa: { intrebare: "Cât de des?" },
  prima_masa: { intrebare: "La cât timp după trezire luați prima masă?" },
  ultima_masa: { intrebare: "Cu cât timp înainte de culcare luați ultima masă?" },
  masa_consistenta: { intrebare: "Care este cea mai consistentă masă a zilei?" },
  omite_mese: { intrebare: "Vi se întâmplă să săriți peste mese principale?" },
  mese_omise: { intrebare: "Care dintre ele?", ajutor: "Puteți alege mai multe răspunsuri." },

  // ---- 10. Grupe de alimente ----
  carne: { intrebare: "Carnea face parte din mesele dumneavoastră?" },
  carne_frecventa: { intrebare: "Cât de des?" },
  carne_detalii: { intrebare: "Ce fel de carne și cum o gătiți de obicei?" },
  lactate: { intrebare: "Consumați lactate?", ajutor: "Lapte, iaurt, chefir, brânză, smântână." },
  lactate_frecventa: { intrebare: "Cât de des?" },
  lactate_detalii: { intrebare: "Care anume?" },
  cereale: {
    intrebare: "Consumați cereale și produse din cereale?",
    ajutor: "Pâine, paste, orez, hrișcă, ovăz, mămăligă.",
  },
  cereale_frecventa: { intrebare: "Cât de des?" },
  cereale_detalii: { intrebare: "Care anume?" },
  boboase: { intrebare: "Consumați leguminoase (boboase)?", ajutor: "Fasole, linte, năut, mazăre." },
  boboase_frecventa: { intrebare: "Cât de des?" },
  boboase_detalii: { intrebare: "Care anume?" },
  nuci: { intrebare: "Consumați nuci și semințe?" },
  nuci_frecventa: { intrebare: "Cât de des?" },
  nuci_detalii: { intrebare: "Care anume?" },
  legume: { intrebare: "Legumele apar în mesele dumneavoastră?" },
  legume_frecventa: { intrebare: "Cât de des?" },
  legume_detalii: { intrebare: "Cam ce cantitate, în ce formă (crude, gătite) și care vă plac cel mai mult?" },
  legume_nu: {
    intrebare: "Sunt legume pe care nu le consumați?",
    ajutor: "Dacă mâncați de toate, scrieți „niciuna”.",
  },
  fructe: { intrebare: "Consumați fructe?" },
  fructe_frecventa: { intrebare: "Cât de des?" },
  fructe_detalii: { intrebare: "Cam ce cantitate, în ce formă și care vă plac?" },
  fructe_uscate: { intrebare: "Consumați și fructe uscate?" },
  fructe_uscate_detalii: { intrebare: "Cât de des, cam cât și care anume?" },
  peste: { intrebare: "Consumați pește?" },
  peste_frecventa: { intrebare: "Cât de des?" },
  peste_detalii: { intrebare: "Ce fel de pește?" },
  oua: { intrebare: "Consumați ouă?" },
  oua_frecventa: { intrebare: "Cât de des?" },
  oua_detalii: { intrebare: "Cum le pregătiți de obicei?" },
  fastfood: { intrebare: "Fast-food-ul apare uneori în mesele dumneavoastră?", ajutor: NIMIC_DE_JUDECAT },
  fastfood_frecventa: { intrebare: "Cât de des?" },
  fastfood_detalii: { intrebare: "Ce produse, de obicei?" },
  dulciuri: { intrebare: "Și dulciurile sau patiseria: apar în zilele dumneavoastră?", ajutor: NIMIC_DE_JUDECAT },
  dulciuri_frecventa: { intrebare: "Cât de des?" },
  dulciuri_detalii: { intrebare: "Care anume, când și cam cât?" },

  // ---- 11. Relația cu mâncarea (SCOFF; formulările le aprobă Mariana) ----
  scoff_1: { intrebare: "Vi se întâmplă să vă provocați vărsături atunci când simțiți că ați mâncat prea mult?" },
  scoff_2: { intrebare: "Vă îngrijorează gândul că ați putea pierde controlul asupra cantității de mâncare?" },
  scoff_3: { intrebare: "Ați slăbit mai mult de 6 kg în ultimele trei luni?" },
  scoff_4: {
    intrebare:
      "Simțiți că aveți kilograme în plus chiar și atunci când cei din jur vă spun că aveți o greutate prea mică?",
  },
  scoff_5: { intrebare: "Ați spune că mâncarea vă domină viața?" },

  // ---- 12. Încheiere ----
  mirodenii: { intrebare: "Folosiți mirodenii sau condimente?" },
  mirodenii_detalii: { intrebare: "Care anume?" },
  informatii: { intrebare: "Mai este ceva ce ați vrea să știe terapeutul integrativ? (opțional)" },

  // ---- Doar în interviul scurt ----
  varsta: {
    intrebare: "Ce vârstă aveți?",
    ajutor: "Vârsta intră în calculele pe care le va verifica terapeutul integrativ.",
  },
  afectiuni: {
    intrebare: "Aveți vreuna dintre aceste probleme de sănătate?",
    ajutor: "Bifați tot ce se potrivește. Despre detalii veți vorbi la consultație.",
  },
  tratament_permanent: {
    intrebare: "Luați un tratament permanent?",
    ajutor: "Medicamente pe care le luați în mod regulat, recomandate de medic.",
  },
  alergii_alimentare: { intrebare: "Aveți alergii sau intoleranțe alimentare?" },
  alimente_evitate: {
    intrebare: "La ce anume? Sunt și alimente pe care nu le consumați? (opțional)",
    ajutor: "Pe scurt. De exemplu: intoleranță la lactoză; nu mănânc pește.",
  },
  mesaj: { intrebare: "Doriți să îi transmiteți ceva Marianei? (opțional)" },
}

/**
 * Formulări diferite în interviul scurt pentru câmpuri care există și în cel complet.
 * Ce nu apare aici folosește textul din CAMPURI.
 */
export const CAMPURI_SCURT: Record<string, TextCamp> = {
  scop_altul: { intrebare: "Ce anume v-ați dori? (opțional)" },
  scop_slabire_kg: {
    intrebare: "Dacă aveți o cifră în minte: câte kilograme v-ați dori să slăbiți? (opțional)",
    ajutor: "Puteți lăsa liber. Veți stabili împreună cu terapeutul integrativ ce este potrivit pentru dumneavoastră.",
  },
  activitate_auto: {
    intrebare: "Câtă mișcare faceți într-o săptămână obișnuită?",
    ajutor: "Alegeți varianta cea mai apropiată. Orice răspuns este bun.",
  },
  mese_pe_zi: { intrebare: "Câte mese aveți de obicei pe zi?", ajutor: "Fără gustări." },
  omite_mese: { intrebare: "Vi se întâmplă să săriți peste mese?" },
}

export function textCamp(id: string, varianta: "scurt" | "complet"): TextCamp | undefined {
  return (varianta === "scurt" ? CAMPURI_SCURT[id] : undefined) ?? CAMPURI[id]
}

/** Ce nu se mai întreabă în interviul scurt; apare în fișă ca listă de discutat la consultație. */
export const NEINTREBATE_SCURT = [
  "ocupația",
  "greutatea maximă și minimă",
  "intervențiile și traumele",
  "antecedentele familiale",
  "suplimentele",
  "fumatul",
  "motivația",
  "somnul",
  "apa și celelalte băuturi",
  "alcoolul",
  "orarul și consistența meselor",
  "grupele de alimente",
  "mirodeniile",
]

/** Text scurt afișat deasupra întrebărilor unui pas. */
export const INTRO_PASI: Record<string, string> = {
  data_nasterii: "Începem cu câteva date de bază.",
  nume: "Mulțumim. Acum câteva date generale.",
  interventii: "Urmează câteva întrebări despre sănătate. Îl ajută pe terapeutul integrativ să știe la ce să fie atentă.",
  motivatie: "Două întrebări scurte despre cum vă simțiți față de schimbare.",
  carne: "Urmează grupele de alimente. Ne interesează ce mâncați de obicei, așa cum este.",
  scoff: "Cinci întrebări scurte despre relația cu mâncarea. Le punem tuturor și nu există răspunsuri bune sau greșite.",
  mirodenii: "Am ajuns aproape de final.",
  // interviul scurt
  despre: "Începem cu câteva date de bază.",
  sanatate: "Câteva întrebări scurte despre sănătate. Îl ajută pe terapeutul integrativ să știe la ce să fie atentă.",
  contact: "Am ajuns la final. Mai avem nevoie doar de datele de contact.",
}

export const ERORI = {
  obligatoriu: "Avem nevoie de acest răspuns ca să putem continua.",
  numar: "Vă rugăm să scrieți un număr.",
  interval: (min: number, max: number) => `Vă rugăm să verificați valoarea (între ${min} și ${max}).`,
  data: "Vă rugăm să alegeți o dată validă.",
  ora: "Vă rugăm să alegeți o oră.",
  antrenament: "Pentru fiecare activitate scrisă, completați de câte ori pe săptămână și intensitatea.",
  optiune: "Vă rugăm să alegeți una dintre variante.",
  preaLung: (max: number) => `Vă rugăm să scurtați răspunsul (cel mult ${max} de caractere).`,
  contact: "Vă rugăm să scrieți un număr de telefon sau o adresă de email.",
}

export const OPRIRI: Record<TipOprire, { titlu: string; paragrafe: string[] }> = {
  minor: {
    titlu: "Vă mulțumim pentru interes",
    paragrafe: [
      "Această evaluare este gândită pentru persoane care au împlinit 18 ani.",
      "Până atunci, alimentația se stabilește cel mai bine împreună cu medicul de familie sau cu medicul pediatru și cu un părinte.",
    ],
  },
  sarcina_alaptare: {
    titlu: "Vă mulțumim că ne-ați spus",
    paragrafe: [
      "În sarcină și în perioada de alăptare, alimentația se stabilește împreună cu medicul dumneavoastră, așa că nu vom pregăti aici o evaluare.",
      "Vă încurajăm să discutați cu medicul care vă urmărește despre orice schimbare în alimentație.",
    ],
  },
  insulina: {
    titlu: "Vă mulțumim că ne-ați spus",
    paragrafe: [
      "Când diabetul este tratat cu insulină, dozele depind de ce și cât mâncați. De aceea, orice schimbare în alimentație se stabilește împreună cu medicul dumneavoastră.",
      "Din acest motiv nu vom pregăti aici o evaluare. Vă încurajăm să vorbiți mai întâi cu medicul care vă urmărește.",
    ],
  },
  imc_sub_18_5: {
    titlu: "Vă mulțumim pentru răspunsuri",
    paragrafe: [
      "Din datele pe care ni le-ați dat, primul pas potrivit pentru dumneavoastră este o discuție cu medicul de familie, înaintea oricărei schimbări în alimentație.",
      "De aceea ne oprim aici și nu pregătim o evaluare.",
    ],
  },
  tulburari_alimentare: {
    titlu: "Vă mulțumim pentru sinceritate",
    paragrafe: [
      "Din răspunsurile dumneavoastră, credem că v-ar ajuta mai mult o discuție cu medicul de familie sau cu un psiholog, înaintea unui plan alimentar.",
      "Nu este un diagnostic, ci o recomandare de a vorbi cu un specialist care vă poate asculta pe îndelete. De aceea ne oprim aici.",
    ],
  },
}

export const UI = {
  titlu: "Evaluare nutrițională",
  bunVenit:
    "Bine ați venit! Înainte de consultația cu terapeutul integrativ de la Casa di Marianna, am vrea să vă cunoaștem puțin, ca timpul de la consultație să fie al dumneavoastră, nu al formularelor. Întrebăm doar ce este necesar pentru evaluarea inițială; restul îl veți discuta la consultație.",
  durata: "Durează doar câteva minute.",
  pas: (pas: number, total: number) => `Pasul ${pas} din ${total}`,

  // ---- Consimțământul (ecranul 1). Bifa este nebifată implicit și obligatorie. ----
  consimtamantSanatate:
    "Sunt de acord ca datele mele, inclusiv cele despre sănătate, să fie folosite pentru evaluarea nutrițională inițială la Casa di Marianna.",
  // {adresa} se înlocuiește cu adresa din variabila de mediu EVALUARE_EMAIL_TO, adică exact
  // adresa la care pleacă fișa. Adresa nu se scrie aici: repo-ul este public.
  informare:
    "Răspunsurile dumneavoastră nu se salvează pe site. Ele se trimit direct pe adresa de email la Casa di Marianna{adresa}, la care are acces doar medicul terapeut integrativ, și sunt folosite doar pentru pregătirea consultației. Puteți cere oricând vizualizarea sau ștergerea lor scriind la aceeași adresă.",
  // Varianta afișată când trimiterea este oprită din config (trimitereActiva: false).
  informareFaraTrimitere:
    "Trimiterea nu este activă încă. Răspunsurile rămân doar în browserul dumneavoastră: nu sunt salvate și nu sunt trimise nicăieri. Dacă închideți sau reîncărcați pagina, ele se pierd.",
  consimtamantAI:
    "Sunt de acord ca răspunsurile mele, fără nume și date de contact, să fie prelucrate cu un serviciu extern de inteligență artificială.",

  incepe: "Începem",
  inapoi: "Înapoi",
  continua: "Continuă",
  finalizeaza: "Finalizează",
  parasire: "Dacă părăsiți pagina, răspunsurile se pierd.",
  capcana: "Lăsați acest câmp necompletat",

  // ---- Trimiterea ----
  trimite: "Trimite",
  seTrimite: "Se trimite…",
  eroareTrimitere:
    "Nu am reușit să trimitem răspunsurile. Nu s-a pierdut nimic: răspunsurile dumneavoastră sunt încă aici. Vă rugăm să încercați din nou peste câteva momente.",
  eroarePreaMulte:
    "Au fost prea multe încercări într-un timp scurt. Răspunsurile dumneavoastră sunt încă aici; vă rugăm să încercați din nou peste câteva minute.",
  eroareRaspunsuri:
    "Unele răspunsuri nu au putut fi verificate. Nu s-a pierdut nimic; vă rugăm să le revedeți cu butonul „Înapoi” și să încercați din nou.",
  eroareConsimtamant:
    "Nu putem trimite răspunsurile fără acordul dumneavoastră. Vă rugăm să reveniți la primul ecran și să bifați acordul.",
  eroareTrimitereContact:
    "Nu am reușit să trimitem datele de contact. Vă rugăm să încercați din nou peste câteva momente.",
  eroareContact: "Vă rugăm să verificați numele și datele de contact.",
  eroareAlternativa: "Dacă problema continuă, ne puteți scrie din pagina de contact.",
  contact: "Pagina de contact",

  // ---- Opririle de siguranță ----
  oprireGreseala: "Am ales din greșeală un răspuns",
  oprireMinor: "Nu am păstrat și nu am trimis niciun răspuns.",
  oprireNetrimis: "Răspunsurile dumneavoastră nu au fost salvate și nu au fost trimise nicăieri.",
  oprireFaraTrimitere: "Dacă doriți să vorbiți cu terapeutul integrativ de la Casa di Marianna, ne găsiți în pagina de contact.",
  oprireContactTitlu: "Doriți să vă contactăm?",
  oprireContactIntro:
    "Dacă doriți, lăsați-ne numele și un număr de telefon sau o adresă de email, iar terapeutul integrativ de la Casa di Marianna vă va contacta. Trimitem doar numele și contactul, nu și răspunsurile dumneavoastră.",
  oprireContactButon: "Doresc să fiu contactat(ă)",
  oprireContactTrimis: "Am trimis numele și datele dumneavoastră de contact. Vă va contacta terapeutul integrativ de la Casa di Marianna.",
  urgenta: "Dacă vă simțiți rău acum sau aveți nevoie urgentă de ajutor, sunați la 112.",

  // ---- Ecranul final ----
  finalTitlu: "Vă mulțumim!",
  finalConfirmare:
    "Răspunsurile dumneavoastră au fost trimise la Casa di Marianna. Vă va contacta terapeutul integrativ pentru programare.",
  finalFaraTrimitere:
    "Trimiterea nu este activă încă, așa că răspunsurile nu au fost trimise. Puteți lua legătura cu terapeutul integrativ de la Casa di Marianna din pagina de contact.",
  finalIntro: "Iată câteva observații, pe scurt:",
  finalAcasa: "Înapoi la site",
}

/** Textul de informare de sub bifă, cu adresa reală de primire (dacă este configurată). */
export function textInformare(adresa?: string): string {
  return UI.informare.replace("{adresa}", adresa ? ` (${adresa})` : "")
}
