import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react" // Adăugăm importul pentru Suspense
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SchemaOrg from "@/components/schema-org"

const inter = Inter({ subsets: ["latin", "latin-ext"] })

export const metadata: Metadata = {
  title: {
    default: "Programe Transformaționale",
    template: "%s | Casa di Marianna",
  },
  description: "Transformare autentică prin consiliere psihologică și echilibru nutrițional",
  keywords:
    "slăbire, nutriție, proceduri, suplimente naturale, consultații nutriționale, consiliere psihologică, Casa di Marianna, Chișinău",
  authors: [{ name: "Casa di Marianna" }],
  creator: "Casa di Marianna",
  publisher: "Casa di Marianna",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://casadimarianna.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Programe Transformaționale | Casa di Marianna",
    description: "Transformare autentică prin consiliere psihologică și echilibru nutrițional",
    url: "https://casadimarianna.com",
    siteName: "Casa di Marianna",
    images: [
      {
        url: "https://casadimarianna.com/images/og-image_.jpg",
        width: 1024,
        height: 536,
        alt: "Casa di Marianna - Programe Transformaționale",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programe Transformaționale | Casa di Marianna",
    description: "Transformare autentică prin consiliere psihologică și echilibru nutrițional",
    images: ["https://casadimarianna.com/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "fb:app_id": "676436128128186",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SZ7RD7QW9Z"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SZ7RD7QW9Z');
            `,
          }}
        />
        <link rel="icon" href="/images/favicon.png" type="image/x-icon"></link>
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div className="p-4">Se încarcă...</div>}>
          <Header />
        </Suspense>
        <main>
          <Suspense fallback={<div className="p-4">Se încarcă conținutul...</div>}>{children}</Suspense>
        </main>
        <Suspense fallback={<div className="p-4">Se încarcă...</div>}>
          <Footer />
        </Suspense>
        <Analytics />
        <SchemaOrg />
      </body>
    </html>
  )
}
