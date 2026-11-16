import type { Metadata } from "next"
import type { ReactNode } from "react"
import { EvaluareProvider } from "./_components/stare"

export const metadata: Metadata = {
  title: "Evaluare nutrițională",
  description: "Un interviu scurt înaintea primei consultații la Casa di Marianna.",
  // Pagina nu se indexează până când Mariana validează metoda și formulările.
  robots: { index: false, follow: false },
}

export default function EvaluareLayout({ children }: { children: ReactNode }) {
  return (
    <EvaluareProvider>
      <section className="bg-white py-8 md:py-12">
        <div className="container-custom">{children}</div>
      </section>
    </EvaluareProvider>
  )
}
