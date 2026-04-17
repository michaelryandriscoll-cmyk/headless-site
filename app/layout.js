// app/layout.js
import "./globals.css";
import LayoutShell from "./components/LayoutShell";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://smallbusiness.capital"),
  title: {
    default: "Small Business Loans & Fast Funding | Small Business Capital",
    template: "%s | Small Business Capital",
  },
  description:
    "Get fast small business loans with flexible terms. Compare working capital, equipment financing, SBA loans, and lines of credit. Funding in as fast as 24–72 hours. Min credit score 580+.",
  keywords: [
    "small business loans",
    "business funding",
    "working capital loans",
    "equipment financing",
    "SBA loans",
    "merchant cash advance",
    "business line of credit",
    "fast business loans",
    "small business financing",
  ],
  authors: [{ name: "Small Business Capital", url: "https://smallbusiness.capital" }],
  creator: "Small Business Capital",
  publisher: "Small Business Capital",
  openGraph: {
    type: "website",
    siteName: "Small Business Capital",
    url: "https://smallbusiness.capital",
    title: "Small Business Loans & Fast Funding | Small Business Capital",
    description:
      "Compare small business loan options and get funded in as fast as 24–72 hours. Working capital, equipment financing, SBA loans, and more. One application, multiple offers.",
    images: [
      {
        url: "/og-image-default.jpg",
        width: 1200,
        height: 630,
        alt: "Small Business Capital — Fast Business Loans",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Small Business Loans & Fast Funding | Small Business Capital",
    description:
      "Get fast small business loans with flexible terms. Funding in as fast as 24–72 hours. Min credit score 580+.",
    images: ["/og-image-default.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://smallbusiness.capital",
  },
  category: "finance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="stylesheet" href="/wp-css/wp-frontend.min.css" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18096733041"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18096733041');
        `}} />
      </head>
      <body className="sbc-body">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}