"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Dacă useSearchParams este folosit aici, îl păstrăm
  // const searchParams = useSearchParams()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom flex items-center justify-between py-1">
        {/* Modifică logo-ul și textul */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/logo-image.jpg" // Înlocuiește cu calea reală către logo-ul tău
            alt=""
            width={40}
            height={40}
            className="h-16 w-auto"
          />
          {/*<span className="text-xl font-bold text-primary">Casa di Marianna</span> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Acasă
          </Link>
          <Link href="/servicii" className="text-foreground hover:text-primary transition-colors">
            Servicii
          </Link>
          <Link href="/testimoniale" className="text-foreground hover:text-primary transition-colors">
            Testimoniale
          </Link>
          <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/faq" className="text-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Link href="/contact" className="btn-primary">
            Programează consultație
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Acasă
            </Link>
            <Link
              href="/servicii"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicii
            </Link>
            <Link
              href="/testimoniale"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimoniale
            </Link>
            <Link
              href="/blog"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/faq"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link href="/contact" className="btn-primary inline-block text-center" onClick={() => setIsMenuOpen(false)}>
              Programează Consultație
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
