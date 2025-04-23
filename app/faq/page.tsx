import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Întrebări frecvente | Casa di Marianna",
  description: "Găsește răspunsuri la cele mai comune întrebări despre programele și serviciile noastre.",
  keywords: "întrebări frecvente slăbire, FAQ nutriție, întrebări proceduri, Casa di Marianna, Chișinău",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Întrebări frecvente | Casa di Marianna",
    description: "Găsește răspunsuri la cele mai comune întrebări despre programele și serviciile noastre.",
    url: "https://casadimarianna.com/faq",
    siteName: "Casa di Marianna",
    images: [
      {
        url: "https://casadimarianna.com/images/og-image.jpg",
        width: 1024,
        height: 536,
        alt: "Întrebări frecvente - Casa di Marianna",
      },
    ],
  },
}

export default function FaqPage() {
  const faqs = [
    {
      category: "Despre programele noastre",
      questions: [
        {
          question: "Cât de repede voi vedea rezultate cu Programul Slăbește cu mine?",
          answer:
            "Majoritatea clienților noștri observă schimbări semnificative după primele ședințe. Rezultatele variază în funcție de metabolismul individual, obiectivele stabilite și gradul de aderență la program.",
        },
        {
          question: "Ce face ca abordarea Casa di Marianna să fie diferită de alte programe de slăbire?",
          answer:
            "Casa di Marianna se diferențiază prin abordarea holistică care combină nutriția personalizată, procedurile specializate și suportul psihologic. Nu oferim doar soluții temporare, ci te învățăm cum să menții un stil de viață sănătos pe termen lung.",
        },
        {
          question: "Pot urma programul de acasă sau trebuie să vin la salon?",
          answer:
            "Oferim atât programe care pot fi urmate de acasă, cât și programe care necesită vizite la salon pentru proceduri specializate. În funcție de obiectivele tale și de programul ales, vom stabili împreună cel mai potrivit plan.",
        },
      ],
    },
    {
      category: "Proceduri și tratamente",
      questions: [
        {
          question: "Sunt procedurile de slăbire dureroase?",
          answer:
            "Procedurile noastre sunt non-invazive și provoacă disconfort minim sau deloc. Majoritatea clienților descriu senzația ca fiind relaxantă sau ușor inconfortabilă, dar tolerabilă.",
        },
        {
          question: "Câte ședințe sunt necesare pentru a vedea rezultate?",
          answer:
            "Numărul de ședințe variază în funcție de procedură și de obiectivele individuale. În general, recomandăm un minim de 6-8 ședințe pentru rezultate vizibile, cu o frecvență de 3-4 ședințe pe săptămână.",
        },
        {
          question: "Care este perioada de recuperare după proceduri?",
          answer:
            "Procedurile noastre nu necesită perioadă de recuperare. Poți reveni imediat la activitățile zilnice normale. În cazul anumitor tratamente, pot apărea ușoare roșeață sau sensibilitate care dispar în câteva ore.",
        },
      ],
    },
    {
      category: "Nutriție și alimentație",
      questions: [
        {
          question: "Voi primi un plan alimentar personalizat?",
          answer:
            "Da, fiecare client primește un plan alimentar personalizat, adaptat preferințelor, stilului de viață și obiectivelor individuale. Planul este ajustat periodic în funcție de progres și feedback.",
        },
        {
          question: "Trebuie să renunț complet la alimentele mele preferate?",
          answer:
            "Nu, filozofia noastră nu se bazează pe restricții severe. Te învățăm cum să incluzi alimentele preferate în mod echilibrat și să faci alegeri inteligente care să susțină obiectivele tale.",
        },
        {
          question: "Cum mă ajută consilierea psihologică în procesul de slăbire?",
          answer:
            "Consilierea psihologică te ajută să identifici și să depășești blocajele emoționale legate de alimentație, să dezvolți o relație sănătoasă cu mâncarea și să menții motivația pe termen lung.",
        },
      ],
    },
    {
      category: "Costuri și programări",
      questions: [
        {
          question: "Care sunt costurile programelor?",
          answer:
            "Costurile variază în funcție de tipul de program și durata acestuia. Oferim pachete personalizate pentru toate bugetele, cu opțiuni de plată flexibile. Pentru detalii specifice, te invităm la o consultație gratuită.",
        },
        {
          question: "Cum pot programa o consultație?",
          answer:
            "Poți programa o consultație gratuită prin formularul de contact de pe site, telefonic la numărul afișat sau prin WhatsApp. Te vom contacta în cel mai scurt timp pentru a stabili data și ora potrivită.",
        },
        {
          question: "Care este politica de anulare?",
          answer:
            "Apreciem dacă anulările sau reprogramările sunt făcute cu cel puțin 24 de ore înainte de programare. Acest lucru ne permite să oferim timpul respectiv altor clienți care așteaptă.",
        },
      ],
    },
  ]

  return (
    <>
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-8 md:py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Întrebări frecvente</h1>
            <p className="text-lg md:text-xl text-gray-700">
              Găsește răspunsuri la cele mai comune întrebări despre programele și serviciile noastre.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Nu ai găsit răspunsul căutat?</h3>
            <p className="text-gray-600 mb-8">
              Contactează-ne și îți vom răspunde la toate întrebările. Suntem aici să te ajutăm!
            </p>
            <Link href="/contact" className="btn-primary">
              Contactează-ne
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
