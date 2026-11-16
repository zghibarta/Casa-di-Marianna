import { FluxEvaluare } from "./_components/flux-evaluare"

// Adresa din textul de informare este chiar adresa la care pleacă fișa (EVALUARE_EMAIL_TO).
// Se citește pe server, din variabilele de mediu: repo-ul este public și nu conține adrese.
function adresaDePrimire(): string | undefined {
  const adresa = process.env.EVALUARE_EMAIL_TO?.trim()
  return adresa && adresa.includes("@") ? adresa : undefined
}

export default function EvaluarePage() {
  return <FluxEvaluare adresaEmail={adresaDePrimire()} />
}
