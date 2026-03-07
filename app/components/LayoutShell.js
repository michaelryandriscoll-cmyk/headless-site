"use client";

import { usePathname } from "next/navigation";
import StateIntentCapture from "./StateIntentCapture";
import ScrollManager from "./ScrollManager";
import Header from "./header";
import Footer from "./footer";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <StateIntentCapture />
      <ScrollManager />
      <Header />

      {/* Remove page-container only on homepage */}
      <main className="page-container">
        {children}
      </main>

      <Footer />
    </>
  );
}