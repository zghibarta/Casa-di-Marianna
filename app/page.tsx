import HeroSection from "@/components/hero-section"
import BenefitsSection from "@/components/benefits-section"
import ServicesPreview from "@/components/services-preview"
import TestimonialsPreview from "@/components/testimonials-preview"
import BeforeAfterSection from "@/components/before-after"
import BlogPreview from "@/components/blog-preview"
import FaqPreview from "@/components/faq-preview"
import CtaSection from "@/components/cta-section"
import ContactForm from "@/components/contact-form"

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <ServicesPreview />
      <TestimonialsPreview />
      <BeforeAfterSection />
      <BlogPreview />
      <FaqPreview />
      <CtaSection />
      <ContactForm />
    </>
  )
}
