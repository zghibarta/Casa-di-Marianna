export default function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "Casa di Marianna",
    url: "https://casadimarianna.com",
    logo: "https://casadimarianna.com/images/logo.svg", // URL absolut actualizat
    image: "https://casadimarianna.com/images/og-image.jpg", // URL absolut actualizat
    description: "Transformare unică prin consiliere psihologică, asistență nutrițională și remodelare corporală.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Str. Braniștii 7/1",
      addressLocality: "Chișinău",
      addressCountry: "Moldova",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "47.023600",
      longitude: "28.869796",
    },
    telephone: "+373 79668884",
    email: "info@casadimarianna.com",
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$",
    sameAs: ["https://facebook.com/casadimarianna", "https://instagram.com/casadimarianna"],
    offers: {
      "@type": "AggregateOffer",
      name: "Servicii de slăbire și nutriție",
      description: "Gamă completă de servicii pentru slăbire sănătoasă și nutriție personalizată",
      priceCurrency: "MDL",
      availability: "https://schema.org/InStock",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
