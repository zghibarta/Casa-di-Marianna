import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function ServicesPreview() {
  const services = [
    {
      id: "consiliere",
      title: "Consiliere psihologică",
      description:
        "Totul începe cu tine: echilibru interior, obiceiuri noi, viață conștientă și grijă pentru sănătatea ta.",
      image: "/images/psihoterapie.jpg",
      link: "/servicii#consiliere",
    },
    {
      id: "nutritie",
      title: "Consultații nutriționale",
      description:
        "Planuri alimentare personalizate în funcție de obiectivele, preferințele și nevoile tale specifice.",
      image: "/images/nutritie.jpg",
      link: "/servicii#nutritie",
    },
    {
      id: "proceduri",
      title: "Proceduri remodelarea corpului",
      description:
        "Tehnologii avansate și tratamente non-invazive pentru reducerea grăsimii localizate și modelarea corpului.",
      image: "/images/proceduri.jpg",
      link: "/servicii#proceduri",
    },
    {
      id: "produse",
      title: "Produse premiate la nivel mondial",
      description:
        "Gama completă de produse naturale pentru controlul greutății, îmbunătățirea digestiei și îngrijire personală.",
      image: "/images/forever.jpg",
      link: "/servicii#produse",
    },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="mb-4">Serviciile noastre complete</h2>
          <p className="text-gray-600 text-lg">
            Oferim o gamă completă de servicii pentru a te ajuta să îți atingi obiectivele de slăbire și să menții un
            stil de viață sănătos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} className="card group overflow-hidden">
              <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link
                href={service.link}
                className="inline-flex items-center text-[#A7C7E7] font-medium hover:text-[#8EB5D9]"
              >
                Află mai multe <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/servicii" className="btn-primary">
            Vezi Toate Serviciile
          </Link>
        </div>
      </div>
    </section>
  )
}
