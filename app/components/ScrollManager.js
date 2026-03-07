"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Always reset scroll on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}