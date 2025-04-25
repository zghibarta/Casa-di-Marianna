import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Search } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog & Sfaturi utile | Casa di Marianna",
  description: "Articole informative și sfaturi practice despre nutriție, slăbire și un stil de viață sănătos.",
  keywords: "blog nutriție, sfaturi slăbire, alimentație sănătoasă, stil de viață sănătos, Casa di Marianna, Chișinău",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog & Sfaturi utile | Casa di Marianna",
    description: "Articole informative și sfaturi practice despre nutriție, slăbire și un stil de viață sănătos.",
    url: "https://casadimarianna.com/blog",
    siteName: "Casa di Marianna",
    images: [
      {
        url: "https://casadimarianna.com/images/blog/blog_mituri.jpg",
        width: 1200,
        height: 630,
        alt: "Blog & Sfaturi utile - Casa di Marianna",
      },
    ],
  },
}

const categories = [
  { name: "Toate articolele", slug: "toate", count: 12 },
  { name: "Nutriție", slug: "nutritie", count: 4 },
  { name: "Slăbire", slug: "slabire", count: 3 },
  { name: "Proceduri", slug: "proceduri", count: 2 },
  { name: "Psihologie", slug: "psihologie", count: 2 },
  { name: "Rețete sănătoase", slug: "retete", count: 1 },
]

const articles = [
  {
    id: 1,
    title: "5 Mituri despre slăbire demontate de specialiști",
    excerpt: "Descoperă adevărul din spatele celor mai comune mituri despre slăbire și alimentație sănătoasă.",
    image: "/images/blog/blog_mituri.jpg",
    date: "15 Martie 2024",
    author: "Mariana Curagău-Zghibarța, nutriționist certificat",
    category: "Slăbire",
    slug: "#",
  },
  {
    id: 2,
    title: "Cum să menții rezultatele după slăbire",
    excerpt: "Strategii eficiente pentru menținerea greutății ideale după finalizarea unui program de slăbire.",
    image: "/images/blog/blog_mentinere.jpg",
    date: "2 Aprilie 2024",
    author: "Mariana Curagău-Zghibarța, nutriționist certificat",
    category: "Slăbire",
    slug: "#",
  },
  {
    id: 3,
    title: "Rolul hidratării în procesul de slăbire",
    excerpt: "Află cum consumul adecvat de apă poate accelera metabolismul și contribui la pierderea în greutate.",
    image: "/images/blog/blog_hidratare.jpg",
    date: "20 Aprilie 2024",
    author: "Mariana Curagău-Zghibarța, nutriționist certificat",
    category: "Nutriție",
    slug: "#",
  },
  {
    id: 4,
    title: "Beneficiile procedurilor de remodelare corporală",
    excerpt: "Descoperă cum procedurile moderne de remodelare corporală pot accelera procesul de slăbire.",
    image: "/images/blog/blog_remodelare.jpg",
    date: "5 Mai 2024",
    author: "Mariana Curagău-Zghibarța, nutriționist certificat",
    category: "Proceduri",
    slug: "#",
  },
  {
    id: 5,
    title: "Mindful Eating: cheia unei relații sănătoase cu mâncarea",
    excerpt: "Învață cum să practici alimentația conștientă pentru a-ți îmbunătăți obiceiurile alimentare.",
    image: "/images/blog/blog_mindful.jpg",
    date: "12 Mai 2024",
    author: "Mariana Curagău-Zghibarța, nutriționist certificat",
    category: "Psihologie",
    slug: "#",
  },
  {
    id: 6,
    title: "Rețete sănătoase pentru micul dejun",
    excerpt: "Colecție de rețete rapide și nutritive pentru diferite mese ale zilei.",
    image: "/images/blog/blog_breakfast.jpg",
    date: "18 Mai 2024",
    author: "Mariana Curagău-Zghibarța, nutriționist certificat",
    category: "Rețete sănătoase",
    slug: "#",
  },
]

export default function BlogPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-8 md:py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">Blog & Sfaturi Utile</h2>
            <p className="text-lg md:text-xl text-gray-700">
              Articole informative și sfaturi practice despre nutriție, slăbire și un stil de viață sănătos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <div key={article.id} className="card group">
                    <Link href={`/blog/${article.slug}`}>
                      <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                        <Image
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2">
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
                        <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-gray-600">{article.excerpt}</p>
                        <span className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Categorii</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/blog/category/${category.slug}`}
                        className="flex items-center justify-between text-gray-600 hover:text-primary"
                      >
                        <span>{category.name}</span>
                        <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">{category.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
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
      </section>
    </>
  )
}
