import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"

// Acest articol este doar un exemplu. În realitate, datele ar veni dintr-o bază de date sau CMS
const article = {
  title: "5 Mituri despre slăbire demontate de specialiști",
  date: "15 Martie 2024",
  author: "Mariana Curagău-Zghibarța, nutriționist certificat",
  image: "/placeholder.svg?height=400&width=800&text=Articol+Blog",
  content: `
  <p>Procesul de slăbire este adesea înconjurat de mituri și informații contradictorii care pot face dificilă alegerea unei abordări sănătoase și eficiente. În acest articol, vom examina și demonta cele mai comune 5 mituri despre slăbire, bazându-ne pe cercetări științifice și experiența specialiștilor noștri.</p>

  <h2>1. Mitul: Trebuie să elimini complet carbohidrații pentru a slăbi</h2>
  <p>Realitatea este că carbohidrații sunt o sursă importantă de energie pentru organism și nu trebuie eliminați complet. Secretul stă în alegerea carbohidraților complecși și controlul porțiilor. Cerealele integrale, legumele și fructele conțin carbohidrați sănătoși și sunt esențiale pentru o dietă echilibrată.</p>

  <h2>2. Mitul: Exercițiile cardiovasculare sunt singura modalitate de a arde grăsimi</h2>
  <p>Deși exercițiile cardiovasculare sunt benefice, antrenamentul de forță este la fel de important. Mușchii activi cresc rata metabolică și ajută la arderea grăsimilor chiar și în repaus. O combinație între cardio și antrenament de forță oferă cele mai bune rezultate.</p>

  <h2>3. Mitul: Poți viza pierderea de grăsime dintr-o zonă specifică</h2>
  <p>Acest concept, cunoscut ca "spot reduction", este un mit. Corpul pierde grăsime în mod uniform, în funcție de genetică și tiparul individual de depozitare a grăsimii. Exercițiile specifice pentru o zonă vor tonifia mușchii, dar nu vor arde selectiv grăsimea din acea zonă.</p>

  <h2>4. Mitul: Trebuie să mănânci foarte puțin pentru a slăbi</h2>
  <p>Restricția calorică severă poate încetini metabolismul și duce la pierderea masei musculare. O abordare moderată, cu un deficit caloric rezonabil și mese regulate, este mai eficientă și sustenabilă pe termen lung.</p>

  <h2>5. Mitul: Suplimentele pentru slăbit sunt soluția miraculoasă</h2>
  <p>Nu există "pastile magice" pentru slăbit. Deși unele suplimente pot susține procesul de slăbire, acestea nu înlocuiesc o dietă echilibrată și exercițiul fizic regulat. Orice produs care promite rezultate rapide fără efort ar trebui privit cu scepticism.</p>

  <h2>Concluzie</h2>
  <p>Slăbirea sănătoasă și durabilă se bazează pe o combinație de alimentație echilibrată, activitate fizică regulată și obiceiuri sănătoase de viață. Este important să abordăm acest proces cu răbdare și să ne bazăm pe informații științifice verificate, nu pe mituri populare.</p>
  <p class="text-gray-600">
    Programul Casa di Marianna mi-a oferit structura și suportul de care aveam nevoie...
  </p>
  <p class="text-gray-600">
    Casa di Marianna m-a ajutat să slăbesc într-un mod sănătos...
  </p>
`,
  relatedArticles: [
    {
      title: "Cum să menții rezultatele după slăbire",
      excerpt: "Strategii eficiente pentru menținerea greutății ideale după finalizarea unui program de slăbire.",
      image: "/placeholder.svg?height=200&width=400&text=Mentinere+Rezultate",
      date: "2 Aprilie 2024",
      author: "Mariana Curagău-Zghibarța, nutriționist certificat",
      slug: "#",
    },
    {
      title: "Rolul hidratării în procesul de slăbire",
      excerpt: "Află cum consumul adecvat de apă poate accelera metabolismul și contribui la pierderea în greutate.",
      image: "/placeholder.svg?height=200&width=400&text=Hidratare",
      date: "20 Aprilie 2024",
      author: "Mariana Curagău-Zghibarța, nutriționist certificat",
      slug: "#",
    },
  ],
}

export default function BlogPost() {
  return (
    <article className="min-h-screen">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
        <div className="container-custom">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{article.author}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            </div>

            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          <aside className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Articole similare</h3>
              <div className="space-y-6">
                {article.relatedArticles.map((related, index) => (
                  <div key={index} className="group">
                    <Link href={`/blog/${related.slug}`}>
                      <div className="relative h-48 mb-3 rounded-md overflow-hidden">
                        <Image
                          src={related.image || "/placeholder.svg"}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{related.title}</h4>
                      <p className="text-sm text-gray-600">{related.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{related.date}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Programează o consultație</h3>
              <p className="text-gray-600 mb-4">
                Vrei să afli mai multe despre cum te putem ajuta să îți atingi obiectivele?
              </p>
              <Link href="/contact" className="btn-primary w-full text-center">
                Contactează-ne
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
