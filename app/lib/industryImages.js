// app/lib/industryImages.js

export const industryImages = {
  roofing: [
    {
      src: "/industries/roofing/roofing-crew.jpg",
      alt: "Roofing contractors working on a residential roof in {city}, {state}"
    },
    {
      src: "/industries/roofing/roof-installation.jpg",
      alt: "New roof installation for a commercial building in {city}, {state}"
    },
    {
      src: "/industries/roofing/roof-inspection.jpg",
      alt: "Roof inspection and repair assessment in {city}, {state}"
    }
  ],

  hvac: [
    {
      src: "/industries/hvac/hvac-technician.jpg",
      alt: "HVAC technician servicing a heating and cooling system in {city}, {state}"
    },
    {
      src: "/industries/hvac/hvac-installation.jpg",
      alt: "Commercial HVAC installation project in {city}, {state}"
    },
    {
      src: "/industries/hvac/hvac-repair.jpg",
      alt: "HVAC repair and maintenance service in {city}, {state}"
    }
  ],

  plumbing: [
    {
      src: "/industries/plumbing/plumbing-repair.jpg",
      alt: "Plumbing repair service at a residential property in {city}, {state}"
    },
    {
      src: "/industries/plumbing/plumbing-installations.jpg",
      alt: "Professional plumbing installation project in {city}, {state}"
    },
    {
      src: "/industries/plumbing/plumbing-inspection.jpg",
      alt: "Licensed plumber inspecting pipes and fixtures in {city}, {state}"
    }
  ],

  /* =====================
     ✅ BATCH 1 INDUSTRIES
  ====================== */

  electrician: [
    {
      src: "/industries/electrician/electrician-service.jpg",
      alt: "Licensed electrician performing electrical service in {city}, {state}"
    },
    {
      src: "/industries/electrician/electrical-installation.jpg",
      alt: "Electrical panel and wiring installation in {city}, {state}"
    },
    {
      src: "/industries/electrician/electrician-repair.jpg",
      alt: "Electrician repairing commercial electrical systems in {city}, {state}"
    }
  ],

  "general-contractors": [
    {
      src: "/industries/general-contractors/construction-project.jpg",
      alt: "General contractor overseeing a construction project in {city}, {state}"
    },
    {
      src: "/industries/general-contractors/jobsite-management.jpg",
      alt: "General contractor managing a job site in {city}, {state}"
    },
    {
      src: "/industries/general-contractors/building-renovation.jpg",
      alt: "Commercial renovation project led by a general contractor in {city}, {state}"
    }
  ],

  landscaping: [
    {
      src: "/industries/landscaping/landscaping-crew.jpg",
      alt: "Landscaping crew maintaining a commercial property in {city}, {state}"
    },
    {
      src: "/industries/landscaping/lawn-care.jpg",
      alt: "Professional lawn care and maintenance in {city}, {state}"
    },
    {
      src: "/industries/landscaping/hardscaping.jpg",
      alt: "Hardscaping and outdoor design project in {city}, {state}"
    }
  ],

  cleaning: [
    {
      src: "/industries/cleaning/commercial-cleaning.jpg",
      alt: "Commercial cleaning service in an office building in {city}, {state}"
    },
    {
      src: "/industries/cleaning/residential-cleaning.jpg",
      alt: "Residential cleaning service in a home in {city}, {state}"
    },
	{
      src: "/industries/cleaning/janitorial-service.jpg",
      alt: "Janitorial cleaning staff at work in {city}, {state}"
    }
    
  ],

  solar: [
    {
      src: "/industries/solar/solar-installation.jpg",
      alt: "Solar panel installation on a commercial building in {city}, {state}"
    },
    {
      src: "/industries/solar/solar-technicians.jpg",
      alt: "Solar technicians installing rooftop panels in {city}, {state}"
    },
    {
      src: "/industries/solar/renewable-energy.jpg",
      alt: "Renewable energy solar system project in {city}, {state}"
    }
  ]
};

export function getIndustryImages(industry, city, state) {
  const images = industryImages[industry] || [];

  return images.map(img => ({
    src: img.src,
    alt: img.alt
      .replace("{city}", city)
      .replace("{state}", state)
  }));
}