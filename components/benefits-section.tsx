import { Heart, Zap, Award, Smile } from "lucide-react"

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Heart className="h-10 w-10 text-primary" />,
      title: "Abordare holistică",
      description:
        "Combinăm nutriția, procedurile specializate și suportul psihologic pentru rezultate optime și de durată.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Rezultate rapide",
      description: "Programele noastre sunt concepute pentru a oferi rezultate vizibile în cel mai scurt timp posibil.",
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Expertiză certificată",
      description: "Echipa noastră este formată din specialiști certificați în nutriție, medicină și psihologie.",
    },
    {
      icon: <Smile className="h-10 w-10 text-primary" />,
      title: "Suport continuu",
      description: "Oferim asistență și monitorizare constantă pe tot parcursul programului tău de transformare.",
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="mb-4">
            De ce să alegi <span className="text-primary">Casa di Marianna</span>?
          </h2>
          <p className="text-foreground text-lg">
            Descoperă beneficiile programelor noastre transformaționale. La sigur ai auzit de "Slăbește cu mine", senzație absolută, recunoscut de toți drept cel mai apreciat și revoluționar proiect de slăbire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="card group hover:border-primary border border-transparent">
              <div className="mb-4 animate-icon group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
