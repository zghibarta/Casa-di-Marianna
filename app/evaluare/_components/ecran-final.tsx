"use client"

// Ecranul final: confirmarea trimiterii și rezumatul scurt (fără cifre și fără plan).
// Răspunsurile nu mai sunt în memorie aici: rezumatul a fost calculat înainte de ștergerea lor.

import Link from "next/link"
import { useEffect, useRef } from "react"
import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { UI } from "@/lib/evaluare/interviu/texte"
import { useEvaluare } from "./stare"

export function EcranFinal() {
  const { stare } = useEvaluare()
  const titluRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titluRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-lg border bg-white p-5 shadow-sm md:p-8">
        <h1 ref={titluRef} tabIndex={-1} className="text-2xl font-semibold outline-none md:text-3xl">
          {UI.finalTitlu}
        </h1>

        {stare.trimis ? (
          <p className="flex items-start gap-3 text-lg text-gray-700">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            {UI.finalConfirmare}
          </p>
        ) : (
          <Alert>
            <AlertDescription className="space-y-2 text-base">
              <p>{UI.finalFaraTrimitere}</p>
              <Link href="/contact" className="font-medium text-primary underline underline-offset-4">
                {UI.contact}
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {stare.rezumat.length > 0 && (
          <>
            <p className="text-lg text-gray-700">{UI.finalIntro}</p>
            <ul className="list-disc space-y-3 pl-5 text-gray-700">
              {stare.rezumat.map((observatie) => (
                <li key={observatie}>{observatie}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <Button asChild variant="outline">
        <Link href="/">{UI.finalAcasa}</Link>
      </Button>
    </div>
  )
}
