import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FisaDebug } from "./fisa-debug"

export const metadata: Metadata = { title: "Evaluare: fișa de verificare" }

// Ecran de dezvoltare: nu există în producție (nici pe preview-urile Vercel, unde
// NODE_ENV este tot „production”). Se folosește local, cu `pnpm dev`.
export default function DebugPage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <FisaDebug />
}
