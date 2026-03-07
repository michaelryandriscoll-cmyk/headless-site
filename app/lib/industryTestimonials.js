// app/lib/industryTestimonials.js
// Centralized, conversion-optimized testimonials with safe fallback

export const industryTestimonials = {
  roofing: [
    {
      quote:
        "We were able to take on storm restoration jobs without waiting months for insurance checks. The funding kept our crews moving.",
      author: "Owner",
      role: "Storm Restoration Roofing Company",
    },
    {
      quote:
        "Approval was fast, and the capital helped us add trucks and crews right when demand spiked.",
      author: "Managing Partner",
      role: "Residential & Commercial Roofing Contractor",
    },
  ],

  hvac: [
    {
      quote:
        "Fast access to capital helped us replace equipment before peak summer season hit.",
      author: "Owner",
      role: "Residential HVAC Company",
    },
    {
      quote:
        "We used the funding to hire technicians and handle increased service calls without cash flow stress.",
      author: "Operations Manager",
      role: "Multi-Truck HVAC Contractor",
    },
  ],

  plumbing: [
    {
      quote:
        "Emergency calls are unpredictable. Having capital available helped us respond faster and take on more jobs.",
      author: "Owner",
      role: "Emergency Plumbing Service",
    },
    {
      quote:
        "The funding gave us flexibility to expand service areas without worrying about upfront costs.",
      author: "Founder",
      role: "Residential & Commercial Plumbing Company",
    },
  ],

  electrician: [
    {
      quote:
        "We financed new service vehicles and tools without slowing down daily operations.",
      author: "Owner",
      role: "Electrical Contracting Company",
    },
    {
      quote:
        "Access to capital helped us confidently take on larger commercial projects.",
      author: "Project Manager",
      role: "Commercial Electrical Firm",
    },
  ],

  landscaping: [
    {
      quote:
        "Funding helped us scale crews ahead of peak season and secure larger maintenance contracts.",
      author: "Owner",
      role: "Commercial Landscaping Company",
    },
    {
      quote:
        "We invested in equipment and grew recurring contracts without straining cash flow.",
      author: "Operations Lead",
      role: "Landscape Maintenance Firm",
    },
  ],

  cleaning: [
    {
      quote:
        "Fast funding helped us hire staff and manage larger contracts without delays.",
      author: "Owner",
      role: "Commercial Cleaning Company",
    },
    {
      quote:
        "Access to capital allowed us to expand services while keeping operations smooth.",
      author: "Founder",
      role: "Residential & Janitorial Cleaning Business",
    },
  ],

  solar: [
    {
      quote:
        "We were able to purchase equipment and take on larger installation projects.",
      author: "Owner",
      role: "Solar Installation Company",
    },
    {
      quote:
        "Funding helped us manage long project timelines without cash flow issues.",
      author: "Operations Director",
      role: "Renewable Energy Contractor",
    },
  ],
};

/* ---------------------------------------------------------
   SAFE GENERIC FALLBACK (DO NOT REMOVE)
--------------------------------------------------------- */
export const genericTestimonials = [
  {
    quote:
      "Fast approval and flexible terms helped us stabilize cash flow and plan ahead.",
    author: "Owner",
    role: "Local Small Business",
  },
  {
    quote:
      "We secured funding quickly without disrupting daily operations.",
    author: "Founder",
    role: "Growing Service-Based Business",
  },
];

/* ---------------------------------------------------------
   HELPER (ALWAYS RETURNS VALID DATA)
--------------------------------------------------------- */
export function getIndustryTestimonials(industryKey) {
  return industryTestimonials[industryKey] || genericTestimonials;
}