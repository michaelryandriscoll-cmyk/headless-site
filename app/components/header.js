"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const FEATURED_STATES = [
  { name: "Texas", slug: "texas" },
  { name: "Florida", slug: "florida" },
  { name: "California", slug: "california" },
  { name: "Georgia", slug: "georgia" },
  { name: "New York", slug: "new-york" },
  { name: "Illinois", slug: "illinois" },
  { name: "Arizona", slug: "arizona" },
  { name: "North Carolina", slug: "north-carolina" },
];

const SITUATIONS = [
  { name: "Selling During Divorce", slug: "divorce", icon: "⚖️" },
  { name: "Facing Foreclosure", slug: "foreclosure", icon: "🏦" },
  { name: "Inherited Property", slug: "inherited-property", icon: "🏡" },
  { name: "Tired Landlord", slug: "tired-landlord", icon: "🔑" },
  { name: "Sell As-Is", slug: "as-is", icon: "🔨" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 120);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className={`phb-header${scrolled ? " phb-header--scrolled" : ""}`}>
      <div className="phb-header__inner">
        <Link href="/" className="phb-header__logo" prefetch={false}>
          <span className="phb-logo-text">Proper<span className="phb-logo-accent">Home</span>Buyer</span>
        </Link>

        <nav className="phb-header__nav" aria-label="Main navigation">
          <Link href="/how-it-works" prefetch={false}>How It Works</Link>

          {/* Sell Fast by State dropdown */}
          <div
            className="phb-header__dropdown-wrap"
            onMouseEnter={() => setActiveDropdown("states")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="phb-header__dropdown-btn">
              Sell Fast by State <span className="phb-header__chevron">▾</span>
            </button>
            {activeDropdown === "states" && (
              <div className="phb-header__dropdown">
                <div className="phb-header__dropdown-grid">
                  {FEATURED_STATES.map((state) => (
                    <Link
                      key={state.slug}
                      href={`/sell-my-house-fast/${state.slug}`}
                      className="phb-header__dropdown-item"
                      prefetch={false}
                    >
                      {state.name}
                    </Link>
                  ))}
                </div>
                <div className="phb-header__dropdown-footer">
                  <Link href="/sell-my-house-fast" className="phb-header__dropdown-all" prefetch={false}>
                    View All 50 States →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Your Situation dropdown */}
          <div
            className="phb-header__dropdown-wrap"
            onMouseEnter={() => setActiveDropdown("situations")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="phb-header__dropdown-btn">
              Your Situation <span className="phb-header__chevron">▾</span>
            </button>
            {activeDropdown === "situations" && (
              <div className="phb-header__dropdown phb-header__dropdown--narrow">
                {SITUATIONS.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/sell-my-house-fast/${s.slug}`}
                    className="phb-header__dropdown-item phb-header__dropdown-item--situation"
                    prefetch={false}
                  >
                    <span className="phb-header__dropdown-icon">{s.icon}</span>
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" prefetch={false}>Resources</Link>
          <Link href="/about-us" prefetch={false}>About</Link>
          <Link href="/contact" prefetch={false}>Contact</Link>
        </nav>

        <Link href="/get-offer" className="phb-header__cta" prefetch={false}>
          Get My Cash Offer
        </Link>

        <button
          className="phb-header__burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="phb-header__mobile">
          <nav>
            <Link href="/how-it-works" onClick={() => setMobileOpen(false)}>How It Works</Link>

            <div className="phb-header__mobile-section">
              <button
                className="phb-header__mobile-section-btn"
                onClick={() => toggleDropdown("states-mobile")}
              >
                Sell Fast by State <span>{activeDropdown === "states-mobile" ? "−" : "+"}</span>
              </button>
              {activeDropdown === "states-mobile" && (
                <div className="phb-header__mobile-submenu">
                  {FEATURED_STATES.map((state) => (
                    <Link
                      key={state.slug}
                      href={`/sell-my-house-fast/${state.slug}`}
                      onClick={() => setMobileOpen(false)}
                      prefetch={false}
                    >
                      {state.name}
                    </Link>
                  ))}
                  <Link href="/sell-my-house-fast" onClick={() => setMobileOpen(false)} className="phb-header__mobile-all">
                    View All 50 States →
                  </Link>
                </div>
              )}
            </div>

            <div className="phb-header__mobile-section">
              <button
                className="phb-header__mobile-section-btn"
                onClick={() => toggleDropdown("situations-mobile")}
              >
                Your Situation <span>{activeDropdown === "situations-mobile" ? "−" : "+"}</span>
              </button>
              {activeDropdown === "situations-mobile" && (
                <div className="phb-header__mobile-submenu">
                  {SITUATIONS.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/sell-my-house-fast/${s.slug}`}
                      onClick={() => setMobileOpen(false)}
                      prefetch={false}
                    >
                      {s.icon} {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/blog" onClick={() => setMobileOpen(false)}>Resources</Link>
            <Link href="/about-us" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link href="/get-offer" className="phb-header__mobile-cta" onClick={() => setMobileOpen(false)}>
              Get My Cash Offer
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}