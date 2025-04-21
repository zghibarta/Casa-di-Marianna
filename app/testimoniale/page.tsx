import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Testimoniale și rezultate | Casa di Marianna",
  description:
    "Descoperă poveștile de succes ale clienților care și-au transformat viața cu ajutorul programelor Casa di Marianna.",
  keywords:
    "testimoniale slăbire, rezultate slăbire, transformări corporale, povești de succes, Casa di Marianna, Chișinău",
  alternates: {
    canonical: "/testimoniale",
  },
  openGraph: {
    title: "Testimoniale și rezultate | Casa di Marianna",
    description:
      "Descoperă poveștile de succes ale clienților care și-au transformat viața cu ajutorul programelor Casa di Marianna.",
    url: "https://casadimarianna.com/testimoniale",
    siteName: "Casa di Marianna",
    images: [
      {
        url: "https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/blog/blog_mentinere.jpg",
        width: 1200,
        height: 630,
        alt: "Testimoniale și Rezultate - Casa di Marianna",
      },
    ],
  },
}

export default function TestimonialePage() {
  const testimonials = [
    {
      id: 1,
      name: "Maria P.",
      image: "/placeholder.svg?height=100&width=100&text=Maria",
      text: "Am pierdut 15 kg în 3 luni, participînd în programul Slăbește cu mine (..la Casa di Marianna). Consultațiile Marianei și meniul personalizat, combinate cu zece proceduri la salon, și-au avut efectul așteptat.",
      rating: 5,
      program: "Pachet Premium",
    },
    {
      id: 3,
      name: "Elena C.",
      image: "/placeholder.svg?height=100&width=100&text=Elena",
      text: "Consilierea psihologică m-a ajutat foarte mult. Cu expertiza și dedicarea Marianei am reușit să-mi schimb obiceiurile alimentare și să slăbesc 8 kg în mod sănătos.",
      rating: 5,
      program: "Pachet Premium",
    },
    {
      id: 5,
      name: "Andreea M.",
      image: "/placeholder.svg?height=100&width=100&text=Andreea",
      text: "Apreciez foarte mult abordarea personalizată și atenția la detalii. Echipa Casa di Marianna m-a ajutat să-mi ating obiectivele de slăbire într-un mod plăcut ).",
      rating: 5,
      program: "Pachet Premium",
    },
  ]

  const transformations = [
    {
      id: 1,
      name: "Andreea M.",
      beforeImage: "/placeholder.svg?height=400&width=300&text=Inainte",
      afterImage: "/placeholder.svg?height=400&width=300&text=Dupa",
      weightLoss: "15 kg",
      duration: "3 luni",
      story:
        "Am încercat numeroase diete înainte, dar niciuna nu a funcționat pe termen lung. Cu programul 'Slăbește cu mine' am învățat să mănânc sănătos și să-mi schimb stilul de viață. Procedurile de masaj cu împachetări au accelerat procesul și m-au ajutat să scap de zonele problematice. Sunt recunoscătoare Marianei pentru tot sprijinul!",
    },
    {
      id: 3,
      name: "Natalia P.",
      beforeImage: "/placeholder.svg?height=400&width=300&text=Inainte",
      afterImage: "/placeholder.svg?height=400&width=300&text=Dupa",
      weightLoss: "12 kg",
      duration: "3 luni",
      story:
        "După sarcină, am avut dificultăți în a reveni la greutatea anterioară. Mariana m-a ajutat să slăbesc într-un mod sănătos, fără să-mi afectez alăptarea. Consilierea psihologică a fost esențială pentru mine. Acum mă simt încrezătoare și plină de energie.",
    },
  ]

  return (
    <>
      <section className="bg-gradient-to-r from-[#A7C7E7]/20 to-[#B2BEB5]/20 py-8 md:py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Testimoniale și rezultate</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Descoperă poveștile de succes ale clienților care și-au transformat viața cu ajutorul programelor Casa di
              Marianna.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Ce spun clienții noștri</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                <div className="text-sm text-gray-500">Program: {testimonial.program}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="transformari" className="py-8 bg-[#A7C7E7]/10">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Transformări reale</h2>

          <div className="space-y-16">
            {transformations.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative h-80">
                        <div className="absolute top-2 left-2 bg-[#B2BEB5] text-white px-3 py-1 rounded-md text-sm font-medium">
                          Înainte
                        </div>
                        <Image
                          src={item.beforeImage || "/placeholder.svg"}
                          alt={`${item.name} înainte`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="relative h-80">
                        <div className="absolute top-2 right-2 bg-[#A7C7E7] text-white px-3 py-1 rounded-md text-sm font-medium">
                          După
                        </div>
                        <Image
                          src={item.afterImage || "/placeholder.svg"}
                          alt={`${item.name} după`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">{item.name}</h3>
                    <div className="flex space-x-4 mb-4">
                      <div className="bg-[#A7C7E7]/10 px-4 py-2 rounded-md">
                        <span className="block text-sm text-gray-600">Pierdere în greutate</span>
                        <span className="font-bold text-[#A7C7E7] text-xl">-{item.weightLoss}</span>
                      </div>
                      <div className="bg-[#A7C7E7]/10 px-4 py-2 rounded-md">
                        <span className="block text-sm text-gray-600">Durată program</span>
                        <span className="font-bold text-[#A7C7E7] text-xl">{item.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{item.story}</p>
                    <Link href="/contact" className="btn-primary self-start">
                      Vreau și eu rezultate similare
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Pregătit să îți începi transformarea?</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Alătură-te celor peste 1000 de clienți mulțumiți care și-au schimbat viața cu ajutorul programelor Casa di
            Marianna.
          </p>
          <Link href="/contact" className="btn-primary">
            Programează o consultație gratuită
          </Link>
        </div>
      </section>
    </>
  )
}
