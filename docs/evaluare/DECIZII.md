# Decizii luate în Faza 1 (de validat de Mariana)

Mariana nu a răspuns încă la cele 18 întrebări din `plan.md` §1. Aurel a delegat alegerea, iar
variantele de mai jos sunt cele provizorii. Toate se schimbă dintr-un singur fișier,
`lib/evaluare/config.ts`, fără modificări de cod; alternativa fiecăreia rămâne implementată și
testată.

**Actualizare, 16.11.2026.** Aurel și Mariana au decis două schimbări față de prima versiune:
interviul durează 5–10 minute (secțiunea 3) și fișa pleacă pe email la Casa di Marianna
(secțiunea 4). Rândurile din secțiunea 2 pe care le-au schimbat sunt marcate „actualizat”.

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
| 3 | Ce se întâmplă la oprire | *Actualizat.* Interviul se încheie imediat, cu mesaj de consult medical și fără cifre. Răspunsurile nu se trimit. Persoana poate lăsa doar numele și contactul, ca să fie sunată. Sub 18 ani se oprește la ecranul cu vârsta, nu se păstrează niciun răspuns și nu există formular de contact. |
| 4 | Frecvențele | Zilnic = 7; foarte des = 5,5; des = 3,5; de 1–2 ori = 1,5; rar = 0,5; niciodată = 0 (pe săptămână). Se păstrează și eticheta, și numărul. |
| 5 | Coeficientul de activitate | *Actualizat.* În interviul scurt nu există orar de antrenamente: codul propune coeficientul din autoapreciere (secțiunea 3) și îl marchează „de confirmat la consultație”. În interviul complet îl propune din orar, ca înainte. |
| 6 | 3 antrenamente | Moderate → 1,375; intense → 1,55. |
| 7 | Măsurătorile | Tipul păstrează cele 14 câmpuri cu denumirile Marianei. Talia = punctul cel mai îngust; abdomenul = la ombilic. În Faza 1 se folosesc doar gât, talie, abdomen și șolduri. |
| 8 | Baza de alimente | Faza 3. Nu s-a făcut. |
| 9 | Împărțirea pe mese | 25 / 10 / 35 / 10 / 20%, în config. |
| 10 | Cui i se aplică deficitul | Doar la scop de slăbire și IMC ≥ 25. |
| 11 | Rezumatul clientei | Apare după confirmarea trimiterii. Este construit din șabloane fixe, nu din textul clientei. O verificare automată respinge orice cifră cu unitate și cuvântul „IMC”. |
| 12 | Programarea | *Actualizat.* Clienta lasă numele și un telefon sau un email, iar Mariana o contactează. Pasul provizoriu cu intervale și canal (care nu trimitea nimic) a fost scos. |
| 13 | Platforma | Ruta `/evaluare` din acest site, nu subdomeniu. Pagina este `noindex` până la validare. |
| 14 | Păstrarea datelor | *Actualizat.* Site-ul nu păstrează nimic: fără bază de date, fără fișiere, fără răspunsuri în jurnale. Fișa există doar în căsuța de email a Casei di Marianna; cât se păstrează acolo și cum se șterge la cerere decide Mariana. |
| 15 | Forever Living | Aplicația nu numește niciun produs. |
| 16 | Forma de adresare | „Dumneavoastră”, cu formulări neutre ca gen. Vezi abaterea de la punctul 4. |
| 17 | Bărbați | Acceptați, cu formulele publicate; fișa primește semnalul „formule de confirmat”. |
| 18 | Cadrul legal | *Actualizat.* Consimțământ explicit, cu o singură bifă nebifată implicit și textul de informare de sub ea (secțiunea 4). Serverul refuză orice trimitere fără acord. Textele sunt în `texte.ts`; merită văzute de un jurist. |

Grupa sanguină: câmpul există, dar este oprit din config (`grupaSanguinaActiva`).

## 3. Interviul scurt (implicit)

Interviul complet (circa 38 de ecrane) era prea lung și prea intim pentru un prim contact.
Varianta implicită este acum `interviu.varianta: "scurt"` în `config.ts`: 10 ecrane, fără niciun
câmp de text lung obligatoriu. Chestionarul complet **nu a fost șters**: revine cu
`varianta: "complet"`, fără alte schimbări, și are în continuare testele lui.

| Ecran | Conținut |
|---|---|
| 1 | Consimțământul, „Durează aproximativ 5-7 minute.” |
| 2 | Vârsta, sexul; la femei: sarcină sau alăptare |
| 3 | Înălțimea, greutatea |
| 4 | Scopul (alegere multiplă); la slăbire, opțional câte kilograme |
| 5 | Sănătate, ca listă de bifat: diabet (și atunci: insulină?), tiroidă, inimă sau tensiune, rinichi, digestivă, alta, niciuna; tratament permanent da/nu |
| 6 | Alergii sau intoleranțe alimentare da/nu; un câmp scurt, opțional, pentru detalii și alimente neconsumate |
| 7 | Mișcarea, o singură alegere |
| 8 | Mese pe zi; sare mese da/nu; mănâncă noaptea da/nu |
| 9 | Cele cinci întrebări SCOFF |
| 10 | Nume, telefon sau email, mesaj opțional, butonul „Trimite” |

Fiecare ecran arată „Pasul X din 10” și o bară de progres.

**Scoase din interviu** (logica lor rămâne în motor și în interviul complet): ocupația, greutatea
maximă și minimă, grupa sanguină, intervențiile, traumele, antecedentele familiale, suplimentele,
fumatul, scările de motivație, orele de somn, apa, alte băuturi, alcoolul, prima și ultima masă,
consistența meselor, cele 11 grupe de alimente, mirodeniile. Fișa din email le enumeră ca
„neîntrebat în interviul scurt, de discutat la consultație”.

**Opririle de siguranță sunt identice** și folosesc aceeași funcție ca motorul de calcul: sub 18
ani, sarcină sau alăptare, diabet tratat cu insulină, IMC sub 18,5, SCOFF ≥ 2.

Alegeri făcute la construirea variantei scurte (de validat):

| Subiect | Ales | De ce |
|---|---|---|
| Vârsta | Vârsta în ani, nu data nașterii | Ajunge pentru formule, se completează mai repede și este o dată mai puțin personală. |
| Alergii | Întrebare da/nu obligatorie, plus un singur câmp scurt și opțional | Un câmp complet opțional ar fi putut fi sărit, iar alergia este un semnal de siguranță pentru Mariana. |
| „Altă problemă de sănătate” | Fără câmp de text | Cerința a fost listă de bifat; detaliile se discută la consultație. Apare ca semnal în fișă. |
| „Niciuna” | Nu se poate combina cu o afecțiune | Bifarea ei le debifează pe celelalte și invers; serverul verifică la fel. |
| „Altceva” la scop | Detaliul este opțional | Fără texte obligatorii, în afară de nume și contact. |
| Contactul | Trebuie să arate a telefon (cel puțin 6 cifre) sau a email | Altfel Mariana nu are cum să răspundă. |
| Bifa „am împlinit 18 ani” | Scoasă | Cerința este o singură bifă; vârsta se întreabă pe ecranul 2, unde se face și oprirea. |
| Etichetele de mișcare | Au repere concrete („de 1–3 ori pe săptămână”) | Din acest răspuns se propune acum coeficientul; reperele sunt cele din tabelul de coeficienți. |

### Valorile implicite folosite în locul datelor lipsă

Calculul complet (RMB, menținere, țintă, macronutrienți, apă, ritm) merge doar cu datele scurte.
Ce nu se mai întreabă este înlocuit astfel, iar fișa spune explicit „de confirmat la consultație”:

| Ce lipsește | Ce se folosește | Unde se schimbă |
|---|---|---|
| Orarul antrenamentelor | Coeficientul vine din autoapreciere: aproape deloc → 1,2; ușoară → 1,375; moderată → 1,465; multă → 1,55; foarte multă → 1,725 (1,75 în varianta A). 1,9 nu se propune niciodată automat. | `metoda.coeficientDinAutoapreciere` |
| Măsurătorile (gât, talie, șolduri) | Procentul de grăsime se estimează cu Deurenberg, din IMC și vârstă; Navy și indicatorii de talie rămân necalculați. | se introduc de Mariana |
| În cât timp vrea să slăbească | Nimic: semnalul „ritm dorit” nu se mai calculează. Kilogramele dorite apar în răspunsuri. | — |
| Somn, apă, alcool, motivație, fumat, suplimente, intervenții | Nimic: nu se presupun valori și nu apar semnale pentru ele. | — |

Oamenii își supraestimează de obicei mișcarea. Un coeficient prea mare ridică ținta calorică, deci
eroarea merge spre „mai multe calorii”, nu spre „prea puține”; pragul minim rămâne oricum activ.

## 4. Trimiterea pe email

- La „Trimite”, browserul trimite răspunsurile la `POST /api/evaluare`. Serverul nu are încredere
  în nimic din ce primește: validează din nou fiecare răspuns, verifică opririle, calculează fișa
  și abia apoi trimite emailul, prin SMTP (nodemailer).
- **Fără bază de date, fără fișiere, fără răspunsuri în jurnal.** În jurnalul serverului ajung
  doar coduri de eroare.
- **Variabile de mediu** (toate obligatorii; `.env.example` conține doar numele):
  `EVALUARE_EMAIL_TO`, `EVALUARE_EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
  Portul 465 folosește TLS de la început; orice alt port cere STARTTLS.
- **Fără aceste variabile:** în dezvoltare și în teste se folosește un transport fals, care nu
  trimite nimic. În producție (inclusiv pe preview-urile Vercel) trimiterea eșuează cu un mesaj
  clar, ca nimeni să nu creadă că fișa a plecat.
- **Emailul.** Subiect: „Evaluare nouă - [prenume]”, fără nicio dată medicală. Corp, ca text
  simplu: date de bază, semnale de atenție, calcul (cu valorile de confirmat), răspunsuri. Se poate
  vedea în `/evaluare/debug`, fără să se trimită.
- **Consimțământul.** Serverul refuză trimiterea dacă cererea nu poartă acordul. Textele bifei și
  ale informării sunt în `texte.ts` (`UI.consimtamantSanatate`, `UI.informare`).
- **Adresa din textul de informare nu este scrisă în cod**, pentru că repo-ul este public. Pagina
  afișează valoarea din `EVALUARE_EMAIL_TO`, adică exact adresa la care pleacă fișa, deci textul
  nu poate ajunge să spună altceva decât ce se întâmplă.
- **Anti-spam.** Un câmp-capcană invizibil (cererile care îl completează primesc „succes”, dar nu
  pleacă niciun email) și cel mult 6 cereri la 10 minute de la aceeași adresă IP
  (`TRIMITERE` în `config.ts`).
- **La o oprire de siguranță** nu pleacă nimic. Persoana vede mesajul de consult medical și poate
  trimite doar numele și contactul. Emailul acela („Cerere de contact - [prenume]”) spune că
  interviul s-a încheiat cu recomandarea de a vorbi cu medicul, fără motiv și fără răspunsuri.
- **Dacă trimiterea eșuează**, clienta vede un mesaj clar, iar formularul rămâne completat.
  După o trimitere reușită, răspunsurile se șterg din memoria browserului; rămâne doar rezumatul.
- **Comutator.** `interviu.trimitereActiva: false` readuce comportamentul vechi: nimic nu
  părăsește browserul, iar serverul refuză orice cerere.

Limite cunoscute:

- Limita pe IP este ținută în memoria funcției. Pe Vercel fiecare instanță are memoria ei, deci
  limita este aproximativă. Pentru una fermă se poate adăuga o regulă în Vercel Firewall pe
  `/api/evaluare`, fără schimbări de cod.
- Emailul nu este un canal criptat cap-coadă: fișa trece prin furnizorul SMTP și rămâne în căsuța
  de email. Legătura cu serverul SMTP este criptată întotdeauna (TLS sau STARTTLS obligatoriu).
- Trimiterea a fost verificată cu un server SMTP de test, local. Cu furnizorul real se verifică
  după ce sunt puse variabilele în Vercel.

## 5. Flow-ul interviului

- Un pas pe ecran. În interviul complet: o întrebare-poartă, cu detaliile ei care apar dedesubt la
  „da” (circa 38 de ecrane).
- Bară de progres „Pasul X din N”, buton „Înapoi”, avertisment la părăsirea paginii.
- Graful (ordinea, condițiile, validarea) este în `lib/evaluare/interviu/`, fără React, ca Faza 3
  să-l poată da modelului AI. Formulările sunt toate în `lib/evaluare/interviu/texte.ts`; cele
  care diferă în interviul scurt sunt în `CAMPURI_SCURT`.
- Opririle din interviu folosesc aceeași funcție ca motorul de calcul, deci regulile nu pot diverge.
- Un răspuns la un detaliu care a dispărut între timp (de exemplu insulina, după ce diabetul a
  fost debifat) nu ajunge în fișă și nu pleacă spre server.
- Ecranul de oprire are un buton „Am ales din greșeală un răspuns”, ca o apăsare greșită să nu
  închidă interviul definitiv.
- În interviul complet, întrebarea despre diabet apare la orice boală cronică, nu doar la
  „sistemul endocrin”, ca oprirea pentru insulină să nu depindă de cum și-a încadrat clienta boala.

## 6. Interpretări și abateri confirmate de Aurel

1. **Coeficientul de activitate din orar** (interviul complet). Tabelul din plan are goluri.
   Regula aplicată: `coef = max(după total, după intense)`.
   - după totalul antrenamentelor pe săptămână: 0 → 1,2; 1–3 → 1,375; 4–5 → 1,465; 6–7 → 1,55;
     peste 7 → 1,9;
   - după cele intense: 3–5 → 1,55; 6–7 → 1,725.
   - „Muncă fizică grea → 1,9” nu se propune automat, pentru că nu există o întrebare structurată.
2. **Forma „tu” nu este scrisă.** Doar „dumneavoastră” are formulări, ca Mariana să nu valideze două
   seturi de texte. Este singura alternativă neimplementată.
3. **Consimțământul pentru AI este ascuns** (`consimtamantAI: false`), pentru că nu se folosește
   AI. Bifa este implementată și apare când se schimbă valoarea.
4. **Praguri pentru semnale, nedefinite în plan:** alcool frecvent = de 3 ori pe săptămână sau mai
   des; somn sub 6 ore. Se aplică doar în interviul complet, unde aceste întrebări există.

## 7. De validat înainte de lansare

- **Adresa de primire.** În textul propus adresa era scrisă cu doi „s” (`cassadimarianna@…`), iar
  domeniul site-ului are unul singur. Fiindcă pagina afișează `EVALUARE_EMAIL_TO`, o greșeală de
  scriere acolo ar trimite fișele în altă parte: de verificat literă cu literă în Vercel.
- **Fraza „la care are acces doar medicul terapeut integrativ”** trebuie să fie adevărată pentru
  căsuța din `EVALUARE_EMAIL_TO` (fără acces partajat, fără redirecționări).
- Toate formulările din `texte.ts`, în special cele cinci întrebări SCOFF, mesajele de oprire,
  lista de afecțiuni și etichetele de mișcare din interviul scurt.
- **Pragul SCOFF.** Două dintre întrebări (controlul asupra mâncării și mâncarea care „domină
  viața”) pot primi „da” de la persoane care vor doar să slăbească, caz în care pragul de 2 le
  oprește interviul. Este o observație de proiectare, neverificată în literatură; merită discutată
  cu Mariana. Pragul este în `PROTECTII.scoffPragOprire`.
- Maparea autoapreciere → coeficient din secțiunea 3.
- „Boboase” apare ca „leguminoase (boboase)” (interviul complet).
- Formulele pentru bărbați și pragul de 1800 kcal.
- Alegerile A/B din secțiunea 1.

## 8. Note tehnice

- `/evaluare/debug` există doar în dezvoltare (`pnpm dev`). În producție, inclusiv pe preview-urile
  Vercel, răspunde cu 404. Pentru codul 404 corect a fost nevoie de un `middleware.ts` limitat la
  această rută, pentru că layout-ul site-ului învelește paginile în `Suspense`.
- Layout-ul site-ului încarcă Google Analytics și pe `/evaluare`. Răspunsurile nu ajung niciodată
  în adresă (pleacă în corpul unei cereri POST), deci analiza vede doar vizita paginii. De decis
  dacă se mai încarcă pe această rută.
- Dependență nouă: `nodemailer` 10.5.0, fără alte pachete aduse de ea. Este versiunea aleasă de
  politica pnpm de vechime minimă a pachetelor; 10.6.0 apăruse cu o zi înainte.
- `pnpm-lock.yaml` conține și actualizări pentru dependențele declarate cu `latest` în
  `package.json` (vue, svelte, @sveltejs/kit), pe care pnpm le rezolvă din nou la orice instalare.
  Site-ul nu le folosește.
- `next.config.mjs` are `ignoreBuildErrors: true`, deci `pnpm build` nu prinde erorile de tip.
  Fișierele evaluării au fost verificate separat cu `tsc --noEmit`.
- Testele rutei sunt în `app/api/evaluare/__tests__/`; `vitest.config.mts` le include.
