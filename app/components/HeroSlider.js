"use client";

import { useState, useEffect } from "react";

export default function HeroSlider() {
  const slides = [
    {
      desktop: "/hero/cafe-owner-2000x800.png",
      mobile: "/hero/cafe-owner-2000x800.png", // use same unless you upload mobile
      title: "Fueling Local Success",
      subtitle: "Flexible small business funding for café owners and community entrepreneurs.",
    },
    {
      desktop: "/hero/construction-worker-2000x800.png",
      mobile: "/hero/construction-worker-2000x800.png",
      title: "Build Bigger, Build Faster",
      subtitle: "Fast working capital and equipment funding for construction professionals.",
    },
    {
      desktop: "/hero/boutique-owner-2000x800.png",
      mobile: "/hero/boutique-owner-2000x800.png",
      title: "Grow Your Brand with Confidence",
      subtitle: "Smart financing options for boutique and retail businesses.",
    },
  ];

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="hero-slider">
      {slides.map((slide, i) => {
        const bgImage = isMobile ? slide.mobile : slide.desktop;

        return (
          <div
            key={i}
            className="hero-slide"
            style={{
              backgroundImage: `url(${bgImage})`,
              display: index === i ? "block" : "none",
            }}
          >
            <div className="hero-overlay" />
            <div className="hero-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}