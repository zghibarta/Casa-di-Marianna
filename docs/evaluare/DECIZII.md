# Decizii luate în Faza 1 (de validat de Mariana)

Mariana nu a răspuns încă la cele 18 întrebări din `plan.md` §1. Aurel a delegat alegerea, iar
variantele de mai jos sunt cele provizorii. Toate se schimbă dintr-un singur fișier,
`lib/evaluare/config.ts`, fără modificări de cod; alternativa fiecăreia rămâne implementată și
testată.

Protecțiile nu fac parte din alegeri și nu se pot dezactiva: vârsta minimă de 18 ani, IMC minim
18,5, oprirea la sarcină/alăptare, la insulină și la SCOFF ≥ 2, pragul caloric minim și blocarea
planului când carbohidrații ies negativi.

## 1. Metoda de calcul

`plan.md` §4 propunea varianta A ca implicită. Aici implicitul este cel de mai jos; varianta A
completă (`VARIANTA_A`) și varianta B completă (`VARIANTA_B`) rămân disponibile și apar alăturat în
`/evaluare/debug`.

| Regulă | Ales | Alternativa | De ce |
|---|---|---|---|
| Reper de greutate | **B**: interval IMC 18,5–24,9 | A: Devine | Devine este o formulă de dozare a medicamentelor. Pe studiul de caz arată 12,5 kg peste limită în loc de 23,2 kg „exces”. Devine se calculează în continuare și apare în fișă. |
| RMB | **B1**: media HB, Mifflin, Katch; Katch cu PGC Navy când există măsurători | A (Katch cu Deurenberg), B2 (doar Mifflin) | Fără măsurători este identică cu A. Diferența față de B2 este sub 20 kcal. |
| Coeficient la 6–7 antrenamente intense | **1,725** | 1,75 (A) | Valoarea uzuală din literatură. Nu afectează studiul de caz. |
| Macronutrienți | **B**: proteine 1,2 g/kg pe greutatea de referință la IMC ≥ 30, grăsimi 30% din calorii | A: 1,2 și 0,9 g/kg corp | A dă 41% grăsimi (peste 20–35% EFSA) și carbohidrați negativi la greutăți mari. Procentul de grăsimi este reglabil între 25% și 35%. |
| Apă | **B**: 30–40 ml/kg pe greutatea de referință la IMC ≥ 30, numită „lichide totale” | A: pe greutatea actuală | A supraestimează la obezitate. |
| Ritm de slăbire | **B**: calculat din deficitul real (7700 kcal/kg), reper 5–10% în 6 luni | A: tabelul 1–2% pe săptămână | 1–2% pe săptămână ar cere un deficit de 900–1900 kcal/zi. Un ritm promis și neatins culpabilizează clienta. |
| Talie și raport talie/înălțime | **activ** | inactiv | Apar doar când există măsurători. |
| Prag minim | F 1200 / B 1800 kcal | de confirmat la bărbați | 1800 este varianta prudentă. |
| Deficit | 500 kcal, doar la scop de slăbire și IMC ≥ 25 | — | La IMC sub 25 cu dorință de slăbire: plan la menținere și semnal pentru Mariana. |
| Împărțirea pe mese | 25 / 10 / 35 / 10 / 20% | configurabil | Se vede doar în fișa de debug; meniul ține de Faza 3. |

Efectul pe studiul de caz (F, 30 de ani, 170 cm, 84,5 kg, coeficient 1,375), fără măsurători:

| | Varianta A | Implicit |
|---|---|---|
| RMB / menținere / țintă | 1583 / 2177 / 1677 kcal | aceleași |
| Proteine | 101 g | 101 g |
| Grăsimi | 76 g (41%) | 56 g (30%) |
| Carbohidrați | 147 g (35%) | 192 g (46%) |
| Reper | Devine 61,3 kg, exces 23,2 kg | 53,5–72,0 kg, 12,5 kg peste limită |
| Ritm | 1–2% pe săptămână | ≈ 0,45 kg pe săptămână |

## 2. Cele 18 întrebări din `plan.md` §1

| # | Întrebare | Decizie |
|---|---|---|
| 1 | Sex, sarcină/alăptare | Adăugate în primul bloc. Sarcina se întreabă doar la femei. |
| 2 | Tulburări alimentare | SCOFF activ, cinci întrebări formulate blând, în blocul 11. Se poate opri din config (`scoffActiv`). |
| 3 | Ce se întâmplă la oprire | Interviul se încheie imediat, cu mesaj de consult medical, fără cifre și fără programare. Sub 18 ani se oprește la data nașterii și nu se păstrează niciun răspuns. |
| 4 | Frecvențele | Zilnic = 7; foarte des = 5,5; des = 3,5; de 1–2 ori = 1,5; rar = 0,5; niciodată = 0 (pe săptămână). Se păstrează și eticheta, și numărul. |
| 5 | Coeficientul de activitate | Codul îl propune din orarul antrenamentelor; Mariana îl confirmă (în Faza 1, din `/evaluare/debug`). Autoaprecierea rămâne text. |
| 6 | 3 antrenamente | Moderate → 1,375; intense → 1,55. |
| 7 | Măsurătorile | Tipul păstrează cele 14 câmpuri cu denumirile Marianei. Talia = punctul cel mai îngust; abdomenul = la ombilic. În Faza 1 se folosesc doar gât, talie, abdomen și șolduri. |
| 8 | Baza de alimente | Faza 3. Nu s-a făcut. |
| 9 | Împărțirea pe mese | 25 / 10 / 35 / 10 / 20%, în config. |
| 10 | Cui i se aplică deficitul | Doar la scop de slăbire și IMC ≥ 25. |
| 11 | Rezumatul clientei | Pleacă direct, dar în Faza 1 este construit din șabloane fixe, nu din textul clientei. O verificare automată respinge orice cifră cu unitate și cuvântul „IMC”. |
| 12 | Programarea | Clienta alege 2–3 intervale și canalul (telefon, Telegram, WhatsApp). Butonul afișează doar că programarea va fi activată în curând. |
| 13 | Platforma | Ruta `/evaluare` din acest site, nu subdomeniu. Pagina este `noindex` până la validare. |
| 14 | Păstrarea datelor | Faza 1 nu păstrează nimic: răspunsurile stau în memoria browserului și dispar la reîncărcare. |
| 15 | Forever Living | Aplicația nu numește niciun produs. |
| 16 | Forma de adresare | „Dumneavoastră”, cu formulări neutre ca gen. Vezi abaterea de la punctul 4. |
| 17 | Bărbați | Acceptați, cu formulele publicate; fișa primește semnalul „formule de confirmat”. |
| 18 | Cadrul legal | Consimțământ explicit, gândit pentru Legea 195/2024 și GDPR. Nota de informare este marcată „[de completat de Mariana / jurist]”. |

Grupa sanguină: câmpul există, dar este oprit din config (`grupaSanguinaActiva`).

## 3. Flow-ul interviului

- Un pas pe ecran: o întrebare-poartă, cu detaliile ei care apar dedesubt la „da”. Rezultă circa
  38 de ecrane pentru o clientă obișnuită, în loc de peste 100 de întrebări separate.
- Bară de progres pe cele 12 blocuri, buton „Înapoi”, avertisment la părăsirea paginii.
- Graful (ordinea, condițiile, validarea) este în `lib/evaluare/interviu/`, fără React, ca Faza 3
  să-l poată da modelului AI. Formulările sunt toate în `lib/evaluare/interviu/texte.ts`.
- Opririle din interviu folosesc aceeași funcție ca motorul de calcul, deci regulile nu pot diverge.
- Un răspuns la un detaliu care a dispărut între timp (de exemplu „ce fel de carne”, după ce
  clienta a schimbat în „nu”) nu ajunge în fișă.
- Ecranul de oprire are un buton „Am ales din greșeală un răspuns”, ca o apăsare greșită să nu
  închidă interviul definitiv.
- Întrebarea despre diabet apare la orice boală cronică, nu doar la „sistemul endocrin”, ca oprirea
  pentru insulină să nu depindă de cum și-a încadrat clienta boala.

## 4. Interpretări și abateri confirmate de Aurel

1. **Coeficientul de activitate.** Tabelul din plan are goluri. Regula aplicată:
   `coef = max(după total, după intense)`.
   - după totalul antrenamentelor pe săptămână: 0 → 1,2; 1–3 → 1,375; 4–5 → 1,465; 6–7 → 1,55;
     peste 7 → 1,9;
   - după cele intense: 3–5 → 1,55; 6–7 → 1,725.
   - „Muncă fizică grea → 1,9” nu se propune automat, pentru că nu există o întrebare structurată;
     Mariana o decide din ocupație.
2. **Forma „tu” nu este scrisă.** Doar „dumneavoastră” are formulări, ca Mariana să nu valideze două
   seturi de texte. Este singura alternativă neimplementată.
3. **Consimțământul pentru AI este ascuns** (`consimtamantAI: false`), pentru că Faza 1 nu folosește
   AI. Bifa este implementată și apare când se schimbă valoarea.
4. **Mesajele de oprire nu spun „Mariana va primi mesajul”** (`trimitereActiva: false`), pentru că
   nu se trimite nimic. Ele trimit spre medic și spre pagina de contact.
5. **Praguri pentru semnale, nedefinite în plan:** alcool frecvent = de 3 ori pe săptămână sau mai
   des; somn sub 6 ore, calculat din ora de culcare și cea de trezire.

## 5. De validat de Mariana înainte de lansare

- Toate formulările din `texte.ts`, în special cele cinci întrebări SCOFF și mesajele de oprire.
- **Pragul SCOFF.** Două dintre întrebări (controlul asupra mâncării și mâncarea care „domină
  viața”) pot primi „da” de la persoane care vor doar să slăbească, caz în care pragul de 2 le
  oprește interviul. Este o observație de proiectare, neverificată în literatură; merită discutată
  cu Mariana. Pragul este în `PROTECTII.scoffPragOprire`.
- Etichetele pentru nivelul de activitate au fost reformulate neutru („Multă mișcare” în loc de
  „Activ”); valorile salvate sunt cele din chestionar.
- „Boboase” apare ca „leguminoase (boboase)”.
- Formulele pentru bărbați și pragul de 1800 kcal.
- Alegerile A/B din secțiunea 1.

## 6. Note tehnice

- `/evaluare/debug` există doar în dezvoltare (`pnpm dev`). În producție, inclusiv pe preview-urile
  Vercel, răspunde cu 404. Pentru codul 404 corect a fost nevoie de un `middleware.ts` limitat la
  această rută, pentru că layout-ul site-ului învelește paginile în `Suspense`.
- Layout-ul site-ului încarcă Google Analytics și pe `/evaluare`. Răspunsurile nu ajung niciodată în
  adresă, deci analiza vede doar vizita paginii. De decis în Faza 2 dacă se încarcă pe această rută.
- `pnpm-lock.yaml` conține și actualizări pentru dependențele declarate cu `latest` în
  `package.json` (vue, svelte, @sveltejs/kit), pe care pnpm le rezolvă din nou la orice instalare.
  Site-ul nu le folosește.
- `next.config.mjs` are `ignoreBuildErrors: true`, deci `pnpm build` nu prinde erorile de tip.
  Fișierele evaluării au fost verificate separat cu `tsc --noEmit`.
