/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  async redirects() {
    return [
      // Redirect old state URLs with -business-loans suffix
      {
        source: "/state-loans/:state-business-loans",
        destination: "/state-loans/:state",
        permanent: true,
      },
      // Redirect old bare state URLs to /state-loans/
      {
        source: "/:state(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new-hampshire|new-jersey|new-mexico|new-york|north-carolina|north-dakota|ohio|oklahoma|oregon|pennsylvania|rhode-island|south-carolina|south-dakota|tennessee|texas|utah|vermont|virginia|washington|west-virginia|wisconsin|wyoming)",
        destination: "/state-loans/:state",
        permanent: true,
      },
      // Capitalized state URLs
      {
        source: "/Pennsylvania",
        destination: "/state-loans/pennsylvania",
        permanent: true,
      },
      {
        source: "/Pennsylvania/",
        destination: "/state-loans/pennsylvania",
        permanent: true,
      },
      {
        source: "/Colorado",
        destination: "/state-loans/colorado",
        permanent: true,
      },
      {
        source: "/Colorado/",
        destination: "/state-loans/colorado",
        permanent: true,
      },
      // Old loan program URLs
      {
        source: "/loan-programs/merchant-cash-advance",
        destination: "/business-services/revenue-based-financing",
        permanent: true,
      },
      {
        source: "/loan-programs/merchant-cash-advance/",
        destination: "/business-services/revenue-based-financing",
        permanent: true,
      },
      {
        source: "/loan-programs/business-loans-for-bad-credit",
        destination: "/loan-programs/low-credit-score-loans",
        permanent: true,
      },
      {
        source: "/loan-programs/business-loans-for-bad-credit/",
        destination: "/loan-programs/low-credit-score-loans",
        permanent: true,
      },
      {
        source: "/sba-loans",
        destination: "/loan-programs/sba-loans",
        permanent: true,
      },
      {
        source: "/sba-loans/",
        destination: "/loan-programs/sba-loans",
        permanent: true,
      },
      // WordPress category pages
      {
        source: "/category/:slug",
        destination: "/blog",
        permanent: true,
      },
      // WordPress tag pages
      {
        source: "/tag/:slug",
        destination: "/blog",
        permanent: true,
      },
      // state/industry/[slug] missing city — redirect to state hub
      {
        source: "/state-loans/:state/industry/:industry",
        destination: "/state-loans/:state",
        permanent: true,
      },
      {
        source: "/state-loans/:state/industry/:industry/",
        destination: "/state-loans/:state",
        permanent: true,
      },
      // state/city/industry missing slug at end — redirect to city page
      {
        source: "/state-loans/:state/:city/industry",
        destination: "/state-loans/:state/:city",
        permanent: true,
      },
      {
        source: "/state-loans/:state/:city/industry/",
        destination: "/state-loans/:state/:city",
        permanent: true,
      },

      // Pruned industries (2026-07-15) — redirect old URLs to sensible fallbacks
      ...[
        "medical",
        "pharmacy",
        "professional-services",
        "wholesale",
        "real-estate",
        "childcare",
        "nonprofit",
        "franchise",
        "technology",
        "ecommerce",
        "general-contractors",
      ].flatMap((slug) => [
        {
          source: `/industries/${slug}`,
          destination: "/industries",
          permanent: true,
        },
        {
          source: `/industries/${slug}/`,
          destination: "/industries",
          permanent: true,
        },
        {
          source: `/state-loans/:state/:city/industry/${slug}`,
          destination: "/state-loans/:state/:city",
          permanent: true,
        },
        {
          source: `/state-loans/:state/:city/industry/${slug}/`,
          destination: "/state-loans/:state/:city",
          permanent: true,
        },
      ]),

    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
