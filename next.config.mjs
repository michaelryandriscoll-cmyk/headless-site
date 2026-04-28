/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // Redirect old state URLs with -business-loans suffix
      {
        source: "/state-loans/:state-business-loans",
        destination: "/state-loans/:state",
        permanent: true,
      },
      // Redirect old bare state URLs (capitalized or lowercase) to /state-loans/
      {
        source: "/:state(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new-hampshire|new-jersey|new-mexico|new-york|north-carolina|north-dakota|ohio|oklahoma|oregon|pennsylvania|rhode-island|south-carolina|south-dakota|tennessee|texas|utah|vermont|virginia|washington|west-virginia|wisconsin|wyoming)",
        destination: "/state-loans/:state",
        permanent: true,
      },
      // Capitalized state URLs Google found
      {
        source: "/Pennsylvania",
        destination: "/state-loans/pennsylvania",
        permanent: true,
      },
      {
        source: "/Colorado",
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
      // Old WordPress tag pages
      {
        source: "/tag/:slug",
        destination: "/blog",
        permanent: true,
      },
      // Old state-loans URLs missing city (just state/industry)
      {
        source: "/state-loans/:state/industry/:industry",
        destination: "/state-loans/:state",
        permanent: true,
      },
      // Old state-loans URLs missing industry slug at end
      {
        source: "/state-loans/:state/:city/industry",
        destination: "/state-loans/:state/:city",
        permanent: true,
      },
      // Old /industries/ path if any
      {
        source: "/industries/:slug",
        destination: "/loan-programs/:slug",
        permanent: true,
      },
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
