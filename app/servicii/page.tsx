import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Programe transformaționale | Casa di Marianna",
  description:
    "Transformare autentică prin consiliere psihologică, echilibru nutrițional și remodelare corporală",
  keywords:
    "proceduri slăbire, consultații nutriționale, consiliere psihologică, produse naturale, Casa di Marianna, Chișinău",
  alternates: {
    canonical: "/servicii",
  },
  openGraph: {
    title: "Programe transformaționale | Casa di Marianna",
    description:
      "Transformare autentică prin consiliere psihologică, echilibru nutrițional și remodelare corporală",
    url: "https://casadimarianna.com/servicii",
    siteName: "Casa di Marianna",
    images: [
      {
        url: "https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/og-image_.jpg",
        width: 588,
        height: 320,
        alt: "Transformare la Casa di Marianna",
      },
    ],
  },
}

export default function ServiciiPage() {
  const services = [
    {
      id: "consiliere",
      title: "Consiliere psihologică",
      description:
        "Totul începe cu tine: echilibru interior, obiceiuri noi, viață conștientă și grijă pentru sănătatea ta",
      image: "https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/psihoterapie.jpg",
      details: [
        "De la echilibru interior la o imagine corporală în armonie",
        "Identificarea și depășirea blocajelor emoționale",
        "Strategii pentru alimentația conștientă (mindful eating)",
        "Tehnici de gestionare a poftelor alimentare",
        "Suport pentru menținerea motivației pe termen lung",
      ],
    },
    {
      id: "nutritie",
      title: "Consultații nutriționale",
      description:
        "Planuri alimentare personalizate în funcție de obiectivele, preferințele și nevoile tale specifice.",
      image: "https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/nutritie.jpg",
      details: [
        "Evaluare nutrițională completă",
        "Analiză a compoziției corporale",
        "Plan alimentar personalizat",
        "Monitorizare și ajustare continuă",
        "Educație nutrițională pentru menținerea rezultatelor",
      ],
    },
    {
      id: "proceduri",
      title: "Proceduri remodelarea corpului",
      description: "Tehnologii avansate și tratamente pentru reducerea grăsimii localizate și modelarea corpului.",
      image: "https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/proceduri.jpg",
      details: [
        "Tehnici speciale de masaj anticelulitic",
        "Masaj de relaxare și modelare corporală",
        "Radiofrecvență - tonifierea pielii și reducerea celulitei",
        "Presoterapie - drenaj limfatic și reducerea retenției de apă",
        "Împachetări corporale - detoxifiere și reducerea circumferințelor",
      ],
    },
    {
      id: "produse",
      title: "Produse premiate la nivel mondial",
      description: "Gama completă de produse naturale pentru controlul greutății, îmbunătățirea digestiei și îngrijire personală.",
      image: "https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/forever.jpg",
      details: [
        "Vitamine/minerale pentru o viață sănătoasă",
        "Băuturi nutritive și snake-uri proteice - nutriție avansată",
        "Produse pentru detoxifiere și curățare internă",
        "Produse apicole pentru hrana corpului și minții",                
        "Îngrijire personală cu Aloe vera - arată și te simte minunat",        
        <Link
          href="https://thealoeveraco.shop/5VHS0OoI"
          className="inline-flex items-center text-[#ff0000] font-medium hover:text-[#8EB5D9]">
          ! PROMOȚIE -15% sau contactează-ne pentru o reducere personală !
        </Link>,        
      ],
    },
  ]

  return (
    <>
      <section className="bg-gradient-to-r from-[#A7C7E7]/20 to-[#B2BEB5]/20 py-8 md:py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Serviciile noastre complete</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Descoperă cât de simplu poate fi să ai un corp sănătos și plin de energie! Programul nostru "Slăbește cu mine" redefinește conceptul de slăbire sănătoasă și echilibrată.
            </p>
          </div>
        </div>
      </section>

      {services.map((service, index) => (
        <section key={service.id} id={service.id} className={`py-8 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
          <div className="container-custom">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                <p className="text-lg text-gray-700 mb-6">{service.description}</p>

                <ul className="space-y-3 mb-8">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-[#A7C7E7] mr-2 mt-1 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="btn-primary">
                  Programează o consultație
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-8 bg-[#A7C7E7]/10">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Abordarea noastră holistică</h2>
          <p className="text-lg max-w-3xl mx-auto mb-12">
            La Casa di Marianna, credem că succesul pe termen lung în procesul de slăbire necesită o abordare integrată
            care să adreseze toate aspectele sănătății tale.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#A7C7E7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#A7C7E7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Echilibru nutrițional</h3>
              <p className="text-gray-600">
                Planuri alimentare personalizate care asigură aportul optim de nutrienți, fără a te simți înfometat sau
                privat.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#A7C7E7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#A7C7E7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Proceduri eficiente</h3>
              <p className="text-gray-600">
                Tehnologii avansate care accelerează procesul de slăbire și modelează corpul pentru rezultate vizibile
                rapid.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#A7C7E7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#A7C7E7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Suport psihologic</h3>
              <p className="text-gray-600">
                Consiliere pentru dezvoltarea unei relații sănătoase cu alimentația și menținerea motivației pe termen
                lung.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pachetele noastre</h2>
            <p className="text-lg text-gray-700">
              Alege pachetul care se potrivește cel mai bine nevoilor și obiectivelor tale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#B2BEB5] p-6 text-white text-center">
                <h3 className="text-2xl font-bold">Pachet Basic</h3>
                <p className="text-lg mt-2">Pentru începători</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Evaluare nutrițională inițială</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Plan alimentar personalizat</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>1 ședință de consiliere</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Suport prin email</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Link href="/contact" className="btn-primary w-full">
                    Alege Pachetul
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#A7C7E7] rounded-lg shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-[#A7C7E7] text-white px-4 py-1 text-sm font-medium">
                Popular
              </div>
              <div className="bg-[#A7C7E7] p-6 text-white text-center">
                <h3 className="text-2xl font-bold">Pachet Premium</h3>
                <p className="text-lg mt-2">Rezultate garantate</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Evaluare nutrițională completă</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Plan alimentar personalizat cu ajustări</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>5 ședințe de proceduri la alegere</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>3 ședințe de consiliere psihologică</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Suport telefonic și prin email</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Link href="/contact" className="btn-primary w-full">
                    Alege Pachetul
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#B2BEB5] p-6 text-white text-center">
                <h3 className="text-2xl font-bold">Pachet VIP</h3>
                <p className="text-lg mt-2">Transformare completă</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Evaluare completă și analize</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Plan alimentar personalizat cu ajustări săptămânale</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>10 ședințe de proceduri la alegere</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>6 ședințe de consiliere psihologică</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Suport 24/7 și consultații de urgență</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Link href="/contact" className="btn-primary w-full">
                    Alege Pachetul
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
