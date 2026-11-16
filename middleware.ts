import { NextResponse, type NextRequest } from "next/server"

// Rulează doar pentru ecranul de dezvoltare al evaluării (vezi `matcher`); restul site-ului
// nu trece prin acest fișier.
//
// În producție, /evaluare/debug trebuie să răspundă cu 404. Pagina apelează deja notFound(),
// dar layout-ul site-ului o învelește în Suspense, așa că răspunsul ar pleca totuși cu codul
// 200. Rescrierea către o adresă inexistentă dă pagina 404 obișnuită, cu codul corect.
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.rewrite(new URL("/_evaluare-debug-indisponibil", request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: "/evaluare/debug/:path*" }
