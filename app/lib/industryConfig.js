// app/lib/industryConfig.js

// Core list of high-value industries for loan SEO
export const industries = [
  {
    slug: "restaurant-loans",
    label: "Restaurant & Food Service",
    shortName: "Restaurant",
    heroTitle: "Restaurant Business Loans",
    heroSubtitle:
      "Working capital, equipment financing and lines of credit for restaurants, cafes and food service businesses.",
    heroBody:
      "Seasonality, food costs and staffing make consistent cash flow a challenge. We help restaurant owners access working capital, equipment financing and credit lines designed around real-world revenue patterns, not just perfect bank statements.",
    bestFor: [
      "Expanding seating or patio space",
      "Upgrading kitchen equipment and POS systems",
      "Bridging seasonal slow periods",
      "Launching second locations or ghost kitchens"
    ],
    faq: [
      {
        q: "How fast can a restaurant get funding?",
        a: "Many restaurant financing programs can approve and fund in 24–72 hours once revenue documentation is submitted."
      },
      {
        q: "Do I need collateral for a restaurant business loan?",
        a: "Many restaurant programs are unsecured and based on bank deposits, credit card volume and time in business rather than hard collateral."
      },
      {
        q: "Can newer restaurants qualify?",
        a: "Yes. Some programs consider businesses with as little as 6–12 months in operation if revenue is consistent."
      }
    ]
  },

  {
    slug: "trucking-loans",
    label: "Trucking & Logistics",
    shortName: "Trucking",
    heroTitle: "Trucking & Logistics Business Financing",
    heroSubtitle:
      "Fuel advances, working capital and equipment financing for owner-operators and fleets.",
    heroBody:
      "Whether you run one truck or a multi-unit fleet, access to working capital and fuel money is critical. We connect carriers and logistics companies with lenders that understand freight cycles, broker payments and aging receivables.",
    bestFor: [
      "Fuel advances and cash-flow gaps",
      "Purchasing or repairing trucks and trailers",
      "Factoring slow-paying invoices",
      "Scaling routes and adding drivers"
    ],
    faq: [
      {
        q: "Can I qualify with older trucks?",
        a: "Yes. Many lenders focus more on revenue and contracts than the exact model year, especially for working capital products."
      },
      {
        q: "Do trucking loans require perfect credit?",
        a: "No. There are programs for a wide range of credit profiles, particularly when business revenues are strong."
      },
      {
        q: "Can I get funding if brokers pay in 30–60 days?",
        a: "Yes. Some products are designed specifically to bridge those payment delays using your receivables."
      }
    ]
  },

  {
    slug: "construction-loans",
    label: "Construction & Trades",
    shortName: "Construction",
    heroTitle: "Construction Business Loans",
    heroSubtitle:
      "Working capital and equipment loans for contractors, builders and specialty trades.",
    heroBody:
      "Construction and trade businesses face upfront material costs, payroll and equipment needs long before projects are paid in full. We help contractors secure financing to keep projects moving without straining cash flow.",
    bestFor: [
      "Covering materials and labor before draws",
      "Financing heavy equipment and vehicles",
      "Staffing up for larger contracts",
      "Bridging gaps between progress payments"
    ],
    faq: [
      {
        q: "Do you work with general contractors and subs?",
        a: "Yes. Programs are available for general contractors, subcontractors and specialty trade businesses."
      },
      {
        q: "Can I qualify if revenue is seasonal?",
        a: "Many construction-focused lenders understand seasonal work and look at average revenue over time."
      },
      {
        q: "Is equipment financing available for used equipment?",
        a: "Some lenders will finance quality used equipment depending on age and condition."
      }
    ]
  },

  {
    slug: "retail-loans",
    label: "Retail & E-Commerce",
    shortName: "Retail",
    heroTitle: "Retail & E-Commerce Business Loans",
    heroSubtitle:
      "Inventory financing, working capital and lines of credit for retail and online brands.",
    heroBody:
      "Inventory, advertising, staffing and lease costs can make it difficult for retailers and e-commerce brands to stay ahead of demand. We help fund inventory purchases, marketing campaigns and expansion plans without tying up all of your cash.",
    bestFor: [
      "Buying inventory ahead of peak seasons",
      "Funding marketing and advertising campaigns",
      "Covering payroll and rent during slower months",
      "Launching new products or sales channels"
    ],
    faq: [
      {
        q: "Can you work with e-commerce only businesses?",
        a: "Yes. Many lenders actively serve online brands, looking at sales history from platforms and payment processors."
      },
      {
        q: "Do I need a long operating history?",
        a: "Some programs work with businesses that have as little as 6–12 months of consistent sales."
      },
      {
        q: "Can inventory be financed directly?",
        a: "Certain lenders offer inventory-specific funding, while others structure it as working capital."
      }
    ]
  },

  {
    slug: "healthcare-loans",
    label: "Healthcare & Professional Services",
    shortName: "Healthcare",
    heroTitle: "Healthcare & Professional Practice Loans",
    heroSubtitle:
      "Financing for medical, dental, therapy and professional practices.",
    heroBody:
      "Practices face high equipment costs, build-out expenses and insurance reimbursement delays. We help healthcare and professional service businesses secure capital for growth, modernization and cash-flow stability.",
    bestFor: [
      "Building out or renovating office space",
      "Purchasing diagnostic or treatment equipment",
      "Hiring staff and adding locations",
      "Smoothing cash flow around insurance reimbursements"
    ],
    faq: [
      {
        q: "Do you work with smaller practices?",
        a: "Yes. Solo and group practices can both qualify based on revenue and time in business."
      },
      {
        q: "Can funding be used for practice acquisition?",
        a: "Some lenders do support practice acquisition and partner buyouts."
      },
      {
        q: "Is financing available for equipment-only needs?",
        a: "Yes. Dedicated equipment financing is available for many healthcare and professional tools."
      }
    ]
  }
];

export const industryMap = Object.fromEntries(
  industries.map((i) => [i.slug, i])
);

export default industryMap;// JavaScript Document