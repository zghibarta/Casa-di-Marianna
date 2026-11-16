// Trimiterea emailului prin SMTP, cu nodemailer. Toate datele de conectare și adresele vin
// DOAR din variabilele de mediu (vezi .env.example); în cod nu există nicio adresă sau parolă.
//
// Fără variabilele SMTP:
//   - în dezvoltare și în teste se folosește un transport fals, care nu trimite nimic;
//   - în producție trimiterea eșuează explicit, ca nimeni să nu creadă că fișa a plecat.

import { createTransport } from "nodemailer"
import type { Email } from "@/lib/evaluare/trimitere/fisa-email"

export const VARIABILE_SMTP = [
  "EVALUARE_EMAIL_TO",
  "EVALUARE_EMAIL_FROM",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
] as const

type Mediu = Record<string, string | undefined>

export interface ConfigSmtp {
  host: string
  port: number
  user: string
  pass: string
  from: string
  to: string
}

/** Numele variabilelor care lipsesc sau sunt invalide (fără valorile lor). */
export function variabileLipsa(env: Mediu): string[] {
  const lipsa: string[] = VARIABILE_SMTP.filter((nume) => !env[nume]?.trim())
  const port = Number(env.SMTP_PORT)
  if (env.SMTP_PORT?.trim() && !(Number.isInteger(port) && port > 0 && port < 65536)) lipsa.push("SMTP_PORT")
  return lipsa
}

export function configSmtpDinEnv(env: Mediu): ConfigSmtp | null {
  if (variabileLipsa(env).length > 0) return null
  return {
    host: env.SMTP_HOST!.trim(),
    port: Number(env.SMTP_PORT),
    user: env.SMTP_USER!.trim(),
    pass: env.SMTP_PASS!,
    from: env.EVALUARE_EMAIL_FROM!.trim(),
    to: env.EVALUARE_EMAIL_TO!.trim(),
  }
}

export type RezultatTransport =
  | { ok: true; transport: "smtp" | "fals" }
  | { ok: false; motiv: "neconfigurat"; lipsa: string[] }
  | { ok: false; motiv: "eroare_smtp"; cod: string }

export async function trimiteEmail(email: Email, env: Mediu = process.env): Promise<RezultatTransport> {
  const smtp = configSmtpDinEnv(env)
  if (!smtp) {
    if (env.NODE_ENV === "production") return { ok: false, motiv: "neconfigurat", lipsa: variabileLipsa(env) }
    // Transport fals: nu se conectează nicăieri și nu păstrează nimic.
    return { ok: true, transport: "fals" }
  }

  const transport = createTransport({
    host: smtp.host,
    port: smtp.port,
    // 465 = TLS de la început; pe celelalte porturi (587) se cere STARTTLS.
    secure: smtp.port === 465,
    requireTLS: smtp.port !== 465,
    auth: { user: smtp.user, pass: smtp.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    // Fișa este text simplu: nu se citesc fișiere sau adrese web în numele mesajului.
    disableFileAccess: true,
    disableUrlAccess: true,
  })
  try {
    await transport.sendMail({ from: smtp.from, to: smtp.to, subject: email.subiect, text: email.text })
    return { ok: true, transport: "smtp" }
  } catch (eroare) {
    // Doar codul erorii: mesajul poate conține adrese sau răspunsul serverului de email.
    const cod = typeof eroare === "object" && eroare !== null && "code" in eroare ? String(eroare.code) : "necunoscut"
    return { ok: false, motiv: "eroare_smtp", cod }
  } finally {
    transport.close()
  }
}
