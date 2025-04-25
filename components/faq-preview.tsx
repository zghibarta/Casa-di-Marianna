"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FaqPreview() {
  const faqs = [
    {
      question: "Cât de repede voi vedea rezultate cu programele Casa di Marianna?",
      answer:
        "Majoritatea clienților noștri observă schimbări semnificative după primele ședințe. Rezultatele variază în funcție de metabolismul individual, obiectivele stabilite și gradul de aderență la program.",
    },
    {
      question: "Programele voastre sunt potrivite pentru persoanele cu probleme medicale?",
      answer:
        "Da, programele noastre sunt personalizate în funcție de nevoile și condițiile medicale ale fiecărui client. Înainte de începerea oricărui program, realizăm o evaluare completă și, dacă este necesar, colaborăm cu medicul tău curant pentru a asigura cea mai sigură și eficientă abordare.",
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
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="mb-4">Întrebări frecvente</h2>
          <p className="text-gray-600 text-lg">
            Răspunsuri la cele mai comune întrebări despre programele și serviciile Casa di Marianna.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(index)}
                aria-expanded={openIndex === index}
              >
                <h3 className="font-medium text-lg">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#A7C7E7]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#A7C7E7]" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 p-4 bg-white" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/faq" className="text-[#A7C7E7] font-medium hover:text-[#8EB5D9]">
            Vezi toate întrebările frecvente
          </Link>
        </div>
      </div>
    </section>
  )
}
