import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-secondary pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Casa di Marianna</h3>
            <p className="text-foreground mb-4">
              Transformare autentică prin consiliere psihologică, asistență nutrițională și remodelare corporală.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/SlabestecumineMasaj.Nutritie"
                className="text-foreground hover:text-primary"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://www.instagram.com/slabeste.cumine/" className="text-foreground hover:text-primary">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-foreground hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Link-uri rapide</h3>
            <ul className="space-y-2">
              {/*<li>
                <Link href="/" className="text-foreground hover:text-primary">
                  Acasă
                </Link>
              </li>*/}
              <li>
                <Link href="/servicii" className="text-foreground hover:text-primary">
                  Servicii
                </Link>
              </li>
              <li>
                <Link href="/testimoniale" className="text-foreground hover:text-primary">
                  Testimoniale
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Servicii</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicii#proceduri" className="text-foreground hover:text-primary">
                  Proceduri de slăbire
                </Link>
              </li>
              <li>
                <Link href="/servicii#nutritie" className="text-foreground hover:text-primary">
                  Consultații nutriționale
                </Link>
              </li>
              <li>
                <Link href="/servicii#consiliere" className="text-foreground hover:text-primary">
                  Consiliere psihologică
                </Link>
              </li>
              <li>
                <Link href="/servicii#produse" className="text-foreground hover:text-primary">
                  Produse și suplimente
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-primary" />
                <span className="text-foreground">+373 79668884</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-primary" />
                <span className="text-foreground">info@casadimarianna.com</span>
              </li>
              <li className="text-foreground mt-2">Str. Braniștii 7/1, Chișinău</li>
              <li className="text-foreground">Program: Luni-Vineri 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Casa di Marianna. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  )
}
