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
    default: "Small Business Capital",
    template: "%s | Small Business Capital",
  },
  description:
    "Fast funding, competitive programs, and nationwide business financing options.",
  openGraph: {
    type: "website",
    siteName: "Small Business Capital",
    title: "Small Business Loans & Funding",
    description:
      "Flexible funding solutions for small businesses across the U.S.",
    images: [
      {
        url: "/og-image-default.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
	
	icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
	icon: "/favicon.ico",
  },
	
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="stylesheet" href="/wp-css/wp-frontend.min.css" />
      </head>
      <body className="sbc-body">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}