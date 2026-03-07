// app/animations.js
"use client";

import { useEffect } from "react";

export default function Animations() {
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const cards = document.querySelectorAll(".feature-box, .home-stat-card, .state-column li");
    
    // -------------------------------
    // Intersection Observer
    // -------------------------------
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(el => observer.observe(el));

    // -------------------------------
    // Staggered entrance for items
    // -------------------------------
    cards.forEach((item, index) => {
      item.style.transitionDelay = `${index * 80}ms`;
      item.classList.add("reveal-item");
    });

    return () => observer.disconnect();
  }, []);

  return null; // Just runs scripts — outputs nothing
}