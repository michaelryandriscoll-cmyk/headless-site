// app/components/CitySchemaScript.js

export default function CitySchemaScript({ cityName, stateName, canonicalUrl }) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Small Business Capital - ${cityName} ${stateName} Business Loans`,
    url: canonicalUrl,
    telephone: "+1-888-365-7999",
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${cityName}, ${stateName}, United States`,
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        // You can later inject real lat/long if you want
        name: `${cityName}, ${stateName}`,
      },
      geoRadius: 50000,
    },
    description: `Business loans, working capital, and equipment financing for companies in ${cityName}, ${stateName}. Fast decisions and no real estate required.`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which types of business loans are available in ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Businesses in ${cityName}, ${stateName} can access working capital advances, business lines of credit, equipment financing, and other alternative lending options through a national lender marketplace.`,
        },
      },
      {
        "@type": "Question",
        name: `Do I need collateral for a business loan in ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Many programs serving ${cityName} focus on business revenue and cash flow instead of hard collateral or real estate, which is ideal for local service, retail, restaurant, and online businesses.`,
        },
      },
      {
        "@type": "Question",
        name: `How fast can I get funded in ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `For complete applications, some ${cityName} businesses receive approvals and funding in as little as 24–72 hours. Larger or more complex requests can take longer depending on documentation and lender review.`,
        },
      },
    ],
  };

  const combined = [businessSchema, faqSchema];

  return (
    <script
      type="application/ld+json"
      // avoid hydration warnings on script content
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combined) }}
    />
  );
}// JavaScript Document