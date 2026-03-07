"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".reveal-on-scroll, .trust-strip__inner"
    );

    if (!("IntersectionObserver" in window)) {
      // Fallback for very old browsers
      elements.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target); // reveal once only
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -80px 0px", // triggers slightly before fully in view
        threshold: 0.15,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}