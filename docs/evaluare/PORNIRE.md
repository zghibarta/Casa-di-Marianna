# Comanda de pornire pentru Claude Code (Faza 1)

Lipește textul de mai jos în Claude Code, cu modelul Fable selectat (`/model`):

---

Citește `CLAUDE.md` și apoi integral `docs/evaluare/plan.md`. Lucrăm doar Faza 1 din CLAUDE.md.

Alegi tu, cu argumente, varianta de calcul și flow-ul interviului (vezi CLAUDE.md). Înainte de cod, dă-mi un plan scurt cu aceste alegeri, structura fișierelor din `lib/evaluare/` și `app/evaluare/`, tipurile principale (răspunsuri, rezultat calcul, semnale, opriri) și ordinea pașilor. Așteaptă confirmarea mea.

După confirmare:
1. Motorul de calcul + config + testele T1–T7 (Vitest). Arată-mi rezultatul `pnpm test`.
2. Interviul adaptiv în `/evaluare` + ecranul `/evaluare/debug`.
3. `pnpm build` fără erori, commit pe ramura `evaluare`, push, apoi deschide un PR draft spre `main` cu un rezumat și lista deciziilor (din `docs/evaluare/DECIZII.md`).
