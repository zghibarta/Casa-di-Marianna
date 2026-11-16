import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Ecran de dezvoltare: nu există în producție (nici pe preview-urile Vercel, unde
// NODE_ENV este tot „production”). Se folosește local, cu `pnpm dev`.

// notFound() se apelează aici, înainte să înceapă trimiterea paginii, ca răspunsul să aibă
// cu adevărat codul 404. Layout-ul site-ului învelește conținutul în Suspense, iar un
// notFound() apelat doar în pagină ar ajunge la browser cu codul 200.
export function generateMetadata(): Metadata {
  if (process.env.NODE_ENV === "production") notFound()
  return { title: "Evaluare: fișa de verificare" }
}

export default async function DebugPage() {
  if (process.env.NODE_ENV !== "production") {
    // Import condiționat: codul fișei nu ajunge deloc în pachetul de producție.
    const { FisaDebug } = await import("./fisa-debug")
    return <FisaDebug />
  }
  notFound()
}
