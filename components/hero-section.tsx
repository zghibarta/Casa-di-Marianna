import Link from "next/link"
import OptimizedImage from "./optimized-image"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-secondary/50 to-primary/10 overflow-hidden">
      <div className="container-custom grid md:grid-cols-2 gap-8 items-center min-h-[80vh] py-8">
        <div className="space-y-6 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Transformă-ți sufletul și corpul la <span className="text-primary">Casa di Marianna</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-lg">
            Alege un stil de viață sănătos și durabil prin consiliere psihologică, asistență nutrițională și remodelare
            corporală.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">
              Programează o consultație
            </Link>
            <Link href="/servicii" className="btn-secondary">
              Descoperă serviciile
            </Link>
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <div className="text-sm">
              <p className="font-medium">Peste 1000+ clienți mulțumiți</p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-foreground">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[500px] lg:h-[500px]">
          <OptimizedImage
            src="/images/hero-image.jpg"
            alt="Prezentare Casa di Marianna"
            fill
            className="object-cover rounded-lg shadow-xl"
            priority
          />

          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-[200px]">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-11 h-10 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="font-bold">Rezultate garantate</span>
            </div>
            <p className="text-sm text-foreground">
              Programul "Slăbește cu mine" - cel mai renumit și inedit proiect al nostru (vedeți recenzii pe social
              media).
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/20 rounded-full filter blur-3xl"></div>
    </section>
  )
}
