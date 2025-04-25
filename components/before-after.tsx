import Image from "next/image"
import Link from "next/link"

export default function BeforeAfterSection() {
  const transformations = [
    {
      id: 1,
      name: "Andreea M.",
      beforeImage: "/placeholder.svg?height=300&width=200&text=Inainte",
      afterImage: "/placeholder.svg?height=300&width=200&text=Dupa",
      weightLoss: "15 kg",
      duration: "3 luni",
      feedback:
        "Am încercat numeroase diete înainte, dar niciuna nu a funcționat pe termen lung. Cu programul 'Slăbește cu mine' am învățat să mănânc sănătos și să-mi schimb stilul de viață. Procedurile de masaj cu împachetări au accelerat procesul și m-au ajutat să scap de zonele problematice. Sunt recunoscătoare Marianei pentru tot sprijinul!",
    },
    {
      id: 2,
      name: "Natalia P.",
      beforeImage: "/placeholder.svg?height=300&width=200&text=Inainte",
      afterImage: "/placeholder.svg?height=300&width=200&text=Dupa",
      weightLoss: "12 kg",
      duration: "3 luni",
      feedback:
        "După sarcină, am avut dificultăți în a reveni la greutatea anterioară. Marianna m-a ajutat să slăbesc într-un mod sănătos, fără să-mi afectez alăptarea. Consilierea psihologică a fost esențială pentru mine. Acum mă simt încrezătoare și plină de energie.",
    },
  ]

  return (
    <section className="section-padding bg-[#A7C7E7]/10">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="mb-4">Transformări reale</h2>
          <p className="text-gray-600 text-lg">
            Rezultate autentice ale clienților noștri care au urmat programele Casa di Marianna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {transformations.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="relative h-80">
                  <div className="absolute top-2 left-2 bg-[#B2BEB5] text-white px-3 py-1 rounded-md text-sm font-medium">
                    Înainte
                  </div>
                  <Image
                    src={item.beforeImage || "/placeholder.svg"}
                    alt={`${item.name} înainte`}
                    fill
                    className="object-cover"
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
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <div className="flex space-x-4 mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-[#A7C7E7] mr-1">-{item.weightLoss}</span>
                    <span className="text-gray-600">pierdere în greutate</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-[#A7C7E7] mr-1">{item.duration}</span>
                    <span className="text-gray-600">durată program</span>
                  </div>
                </div>
                <p className="text-gray-600">{item.feedback}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/testimoniale#transformari" className="btn-primary">
            Vezi mai multe transformări
          </Link>
        </div>
      </div>
    </section>
  )
}
