# CLAUDE.md – Casa di Marianna

Site-ul casadimarianna.com: Next.js 15 (App Router), React 19, TypeScript, Tailwind 3, shadcn/ui, pnpm, găzduit pe Vercel. Interfața este în limba română.

## Sarcina curentă: aplicația de evaluare nutrițională (`/evaluare`)

Specificația completă este în `docs/evaluare/plan.md`. Citește-o integral înainte de a scrie cod.
- Secțiunea 7 („Promptul final pentru Lovable”) descrie același produs pentru altă platformă: folosește-o doar ca specificație funcțională. NU folosim Lovable; construim aici, în acest repo.
- Cele 18 întrebări din secțiunea 1 NU au răspuns de la Mariana. Aurel ți-a delegat alegerea: pentru fiecare, alege varianta cea mai oportună (metoda de calcul A sau B pe fiecare regulă, flow-ul interviului, formulările). Criterii: siguranța clientei, corectitudine științifică, experiență plăcută, fără culpabilizare.
- Fiecare decizie rămâne configurabilă dintr-un singur fișier (`lib/evaluare/config.ts`), cu un comentariu scurt care spune ce ai ales și de ce, iar alternativa rămâne implementată. Mariana le validează înainte de lansare.
- Protecțiile (carbohidrați negativi, prag minim kcal, opriri de siguranță) se aplică indiferent de alegeri.
- Listează toate deciziile în `docs/evaluare/DECIZII.md` și în descrierea PR-ului.

## Doar Faza 1 acum
1. **Motor de calcul** pur TypeScript în `lib/evaluare/` (fără React, fără I/O): IMC, Devine, PGC Deurenberg și Navy, Harris-Benedict, Mifflin-St Jeor, Katch-McArdle, RMB, coeficient de activitate, țintă, macronutrienți A/B, apă, ritm, opriri de siguranță, semnale pentru Mariana. Precizie completă în calcul, rotunjire doar la afișare.
2. **Teste** cu Vitest pentru T1–T7 din `plan.md` §4 (adaugă `vitest` ca devDependency și scriptul `"test": "vitest run"`). Toate trebuie să treacă.
3. **Interviul adaptiv** ca UI în `app/evaluare/`, după graful din §3: bară de progres pe blocuri, întrebări care apar/dispar după răspunsuri, opriri blânde cu mesaj de consult medical, ecran final cu rezumat scurt (3–4 observații, fără cifre și fără plan) și pasul de programare. Pagina de consimțământ e prima.
4. Stare doar în browser (React state). **Fără bază de date, fără API AI, fără trimitere de date** în Faza 1. Butonul final afișează un mesaj că programarea va fi activată în curând.
5. Un ecran de dezvoltare `app/evaluare/debug` (doar în `NODE_ENV !== "production"`) care arată fișa completă pentru Mariana calculată din răspunsuri, ca să putem verifica motorul.

Faza 2 (bază de date UE, panoul Marianei, autentificare) și Faza 3 (AI pe server) NU se fac acum.

## Reguli
- Nu modifica paginile existente ale site-ului, cu excepția unui link discret spre `/evaluare` doar dacă ți se cere.
- Repo-ul este PUBLIC: niciun secret, nicio cheie, nicio dată reală de clientă în cod sau în teste. Datele de test sunt cele anonime din `plan.md`.
- Nu numi produse Forever Living în aplicație.
- Nu folosi termeni nedovediți științific („detoxifiere”). Ton blând, fără culpabilizare (abordare anti-dietă).
- Folosește componentele shadcn/ui existente din `components/ui` și stilul site-ului.
- Rulează `pnpm test` și `pnpm build` înainte de fiecare commit; ambele trebuie să treacă.
- Commit-uri mici, mesaje clare. Lucrezi pe ramura `evaluare`; la final deschide un **Pull Request draft** spre `main`. Nu face merge.
- Dacă o formulă din `plan.md` e ambiguă sau contrazice testele, oprește-te și întreabă, nu ghici.
