"use client";

import { useEffect } from "react";

export default function FaqAccordion() {
  useEffect(() => {
    const items = document.querySelectorAll(".faq-item");

    items.forEach((item) => {
      const button = item.querySelector(".faq-question");

      if (!button) return;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // close all
        items.forEach((i) => i.classList.remove("active"));

        // toggle current
        if (!isOpen) {
          item.classList.add("active");
        }
      });
    });

    // cleanup (important for Next.js)
    return () => {
      items.forEach((item) => {
        const button = item.querySelector(".faq-question");
        if (!button) return;
        button.replaceWith(button.cloneNode(true));
      });
    };
  }, []);

  return null;
}