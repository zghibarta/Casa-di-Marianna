import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowRight } from "lucide-react"

export default function BlogPreview() {
  const articles = [
    {
      id: 1,
      title: "5 mituri despre slăbire demontate de specialiști",
      excerpt: "Descoperă adevărul din spatele celor mai comune mituri despre slăbire și alimentație sănătoasă.",
      image: "/images/blog/blog_mituri.jpg",
      date: "15 Martie 2024",
      author: "Mariana Curagău-Zghibarța, nutriționist certificat",
      slug: "#",
    },
    {
      id: 2,
      title: "Cum să menții rezultatele după slăbire",
      excerpt: "Strategii eficiente pentru menținerea greutății ideale după finalizarea unui program de slăbire.",
      image: "/images/blog/blog_mentinere.jpg",
      date: "2 Aprilie 2024",
      author: "Mariana Curagău-Zghibarța, nutriționist certificat",
      slug: "#",
    },
    {
      id: 3,
      title: "Mindful Eating: cheia unei relații sănătoase cu mâncarea",
      excerpt: "Învață cum să practici alimentația conștientă pentru a-ți îmbunătăți obiceiurile alimentare.",
      image: "/images/blog/blog_mindful.jpg",
      date: "20 Aprilie 2024",
      author: "Mariana Curagău-Zghibarța, nutriționist certificat",
      slug: "#",
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="mb-4">Blog & Sfaturi utile</h2>
          <p className="text-gray-600 text-lg">
            Articole informative și sfaturi practice despre nutriție, slăbire și un stil de viață sănătos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="card group overflow-hidden">
              <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <div className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.author}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center text-[#A7C7E7] font-medium hover:text-[#8EB5D9]"
              >
                Citește mai mult <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog" className="btn-primary">
            Vizitează Blogul
          </Link>
        </div>
      </div>
    </section>
  )
}
