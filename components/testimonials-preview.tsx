import Image from "next/image"
import Link from "next/link"

export default function TestimonialsPreview() {
  const testimonials = [
    {
      id: 1,
      name: "Maria P.",
      image: "/placeholder.svg?height=100&width=100&text=Maria",
      text: "Am pierdut 15 kg în 3 luni în programul Slăbește cu mine (..la Casa di Marianna). Consultațiile Marianei și meniul personalizat, combinate cu zece proceduri la salon, și-au avut efectul așteptat.",
      rating: 5,
    },
    {
      id: 3,
      name: "Elena C.",
      image: "/placeholder.svg?height=100&width=100&text=Elena",
      text: "Consilierea psihologică m-a ajutat foarte mult. Cu expertiza și dedicarea Marianei am reușit să-mi schimb obiceiurile alimentare și să slăbesc 8 kg în mod sănătos.",
      rating: 4,
    },
    {
      id: 5,
      name: "Andreea M.",
      image: "/placeholder.svg?height=100&width=100&text=Andreea",
      text: "Apreciez foarte mult abordarea personalizată și atenția la detalii. Echipa Casa di Marianna m-a ajutat să-mi ating obiectivele de slăbire într-un mod plăcut ).",
      rating: 5,
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="mb-4">Ce spun clienții noștri</h2>
          <p className="text-gray-600 text-lg">
            Descoperă rezultatele de succes ale clienților care și-au transformat viața cu ajutorul programelor Casa di
            Marianna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/testimoniale" className="btn-primary">
            Vezi toate testimonialele
          </Link>
        </div>
      </div>
    </section>
  )
}
