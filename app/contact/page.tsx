import ContactForm from "@/components/ContactForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contactează-ne | Casa di Marianna",
  description:
    "Contactează echipa Casa di Marianna pentru programări, întrebări sau informații suplimentare.",
  keywords: "contact Casa di Marianna, programare consultație, adresă centru slăbire, telefon nutriționist, Chișinău",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contactează-ne | Casa di Marianna",
    description: "Contactează echipa Casa di Marianna pentru programări, întrebări sau informații suplimentare.",
    url: "https://casadimarianna.com/contact",
    siteName: "Casa di Marianna",
    images: [
      {
        url: "https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/og-image.jpg",
        width: 1024,
        height: 536,
        alt: "Contactează-ne - Casa di Marianna",
      },
    ],
  },
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-8 md:py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Hai să găsim soluții împreună!</h1>
            <p className="text-lg md:text-xl text-gray-700">
              Te ajutăm cu orice întrebări și te ghidăm spre un stil de viață sănătos și echilibrat.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-10 pb-10 bg-white">
        <div className="container-custom">
          <ContactForm />
        </div>
      </section>

      <section className="pt-0 pb-8 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6 text-center">Locația noastră</h2>
          <div className="rounded-lg overflow-hidden h-[400px] relative shadow-lg mx-auto max-w-4xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5438.16743754321!2d28.866214000000003!3d47.038588!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d46eee22db9%3A0x7660ae1dde8d6391!2sCasa%20di%20Marianna!5e0!3m2!1sro!2snl!4v1741464321432!5m2!1sro!2snl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  )
}
