"use client";

import WhiteLogo from "@/components/logo/sbc-logo-white.js";
import WhiteLogoMobile from "@/components/logo/sbc-logo-white-mobile";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// ── Industries grouped by category ──
const INDUSTRY_GROUPS = [
  {
    label: "Construction & Trades",
    items: [
      { name: "Roofing", slug: "roofing" },
      { name: "Construction", slug: "construction" },
      { name: "Electrician", slug: "electrician" },
      { name: "HVAC", slug: "hvac" },
      { name: "Plumbing", slug: "plumbing" },
      { name: "Landscaping", slug: "landscaping" },
    ],
  },
  {
    label: "Food & Hospitality",
    items: [
      { name: "Restaurants", slug: "restaurants" },
      { name: "Food Truck", slug: "food-truck" },
      { name: "Salon & Spa", slug: "salon-spa" },
      { name: "Food Services", slug: "food-services" },
    ],
  },
  {
    label: "Professional Services",
    items: [
      { name: "Trucking", slug: "trucking" },
      { name: "Ecommerce", slug: "ecommerce" },
      { name: "Franchise", slug: "franchise" },
      { name: "Real Estate", slug: "real-estate" },
      { name: "Technology", slug: "technology" },
      { name: "Manufacturing", slug: "manufacturing" },
    ],
  },
  {
    label: "Retail & Consumer",
    items: [
      { name: "Retail", slug: "retail" },
      { name: "Auto Repair", slug: "auto-repair" },
      { name: "Childcare", slug: "childcare" },
      { name: "Medical", slug: "medical" },
      { name: "Fitness", slug: "fitness" },
      { name: "Cleaning", slug: "cleaning" },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [loanPrograms, setLoanPrograms] = useState([]);
  const [businessServices, setBusinessServices] = useState([]);

  const DEFAULT_FEATURED_STATES = useMemo(
    () => [
      { name: "Texas", slug: "texas" },
      { name: "Florida", slug: "florida" },
      { name: "California", slug: "california" },
      { name: "New York", slug: "new-york" },
      { name: "Illinois", slug: "illinois" },
      { name: "Georgia", slug: "georgia" },
    ],
    []
  );

  const FEATURED_BY_REGION = useMemo(
    () => ({
      west: [
        { name: "California", slug: "california" },
        { name: "Arizona", slug: "arizona" },
        { name: "Colorado", slug: "colorado" },
        { name: "Washington", slug: "washington" },
        { name: "Oregon", slug: "oregon" },
        { name: "Nevada", slug: "nevada" },
      ],
      south: [
        { name: "Texas", slug: "texas" },
        { name: "Florida", slug: "florida" },
        { name: "Georgia", slug: "georgia" },
        { name: "North Carolina", slug: "north-carolina" },
        { name: "Tennessee", slug: "tennessee" },
        { name: "Louisiana", slug: "louisiana" },
      ],
      midwest: [
        { name: "Illinois", slug: "illinois" },
        { name: "Ohio", slug: "ohio" },
        { name: "Michigan", slug: "michigan" },
        { name: "Indiana", slug: "indiana" },
        { name: "Wisconsin", slug: "wisconsin" },
        { name: "Minnesota", slug: "minnesota" },
      ],
      northeast: [
        { name: "New York", slug: "new-york" },
        { name: "Pennsylvania", slug: "pennsylvania" },
        { name: "New Jersey", slug: "new-jersey" },
        { name: "Massachusetts", slug: "massachusetts" },
        { name: "Connecticut", slug: "connecticut" },
        { name: "Maryland", slug: "maryland" },
      ],
    }),
    []
  );

  const [featuredStates, setFeaturedStates] = useState(DEFAULT_FEATURED_STATES);

  useEffect(() => {
    try {
      const tz =
        Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() || "";
      let region = "";
      if (tz.includes("los_angeles") || tz.includes("vancouver") || tz.includes("denver") || tz.includes("phoenix")) {
        region = "west";
      } else if (tz.includes("chicago")) {
        region = "midwest";
      } else if (tz.includes("new_york")) {
        region = "northeast";
      } else if (tz.includes("miami") || tz.includes("houston") || tz.includes("dallas")) {
        region = "south";
      }
      setFeaturedStates(
        region && FEATURED_BY_REGION[region]
          ? FEATURED_BY_REGION[region]
          : DEFAULT_FEATURED_STATES
      );
    } catch {
      setFeaturedStates(DEFAULT_FEATURED_STATES);
    }
  }, [DEFAULT_FEATURED_STATES, FEATURED_BY_REGION]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 120);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
        setOpenSection(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadLoanPrograms() {
      try {
        const res = await fetch("/api/loan-programs", { cache: "force-cache" });
        const json = await res.json();
        if (cancelled) return;
        const programs = Array.isArray(json?.programs) ? json.programs : [];
        const cleaned = programs
          .map((p) => ({
            title: typeof p?.title === "string" ? p.title : p?.title?.rendered || "Loan Program",
            href: typeof p?.href === "string" ? p.href : "",
          }))
          .filter((p) => p.href && p.href.startsWith("/loan-programs/"));
        cleaned.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        setLoanPrograms(cleaned);
      } catch {
        if (!cancelled) setLoanPrograms([]);
      }
    }
    loadLoanPrograms();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadBusinessServices() {
      try {
        const res = await fetch("/api/business-services", { cache: "force-cache" });
        const json = await res.json();
        if (cancelled) return;
        const raw =
          (Array.isArray(json?.items) && json.items) ||
          (Array.isArray(json?.services) && json.services) ||
          (Array.isArray(json?.pages) && json.pages) ||
          [];
        const cleaned = raw
          .map((s) => ({
            title: s?.title || s?.name || "Business Service",
            href: s?.href || (s?.slug ? `/business-services/${s.slug}` : ""),
          }))
          .filter((s) => s.href && s.href.startsWith("/business-services/"));
        cleaned.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        setBusinessServices(cleaned);
      } catch {
        if (!cancelled) setBusinessServices([]);
      }
    }
    loadBusinessServices();
    return () => { cancelled = true; };
  }, []);

  const loanProgramsMenu = useMemo(() => [
    { title: "All Loan Programs", href: "/loan-programs" },
    ...loanPrograms,
  ], [loanPrograms]);

  const businessServicesMenu = useMemo(() => {
    const fallback = [
      { title: "Credit Repair", href: "/business-services/credit-repair" },
      { title: "Startup Business Help", href: "/business-services/startup-business-help" },
      { title: "Business Plan Creation", href: "/business-services/business-plan-creation" },
    ];
    return [
      { title: "All Business Services", href: "/business-services" },
      ...(businessServices.length ? businessServices : fallback),
    ];
  }, [businessServices]);

  const toggleSection = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenSection(null);
  };

  return (
    <header className={`elite-header ${scrolled ? "scrolled" : ""}`}>

      <div className="elite-nav-wrapper">
        <div className="elite-nav-inner">

          {/* Logo */}
          <div className="elite-logo">
            <Link href="/" aria-label="Small Business Capital home">
              <span className="elite-logo-wrap">
                <span className="logo-desktop">
                  <WhiteLogo className="elite-logo-svg" />
                </span>
                <span className="logo-mobile">
                  <WhiteLogoMobile className="elite-logo-svg" />
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="elite-desktop-nav">
            <ul className="elite-nav-list">

              <li className="elite-nav-item elite-has-dropdown">
                <Link href="/loan-programs" className="elite-nav-link" prefetch>
                  Loan Programs
                </Link>
                <div className="elite-dropdown elite-dropdown--two-col">
                  {loanProgramsMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={item.href === "/loan-programs" ? "elite-dropdown-hub" : ""}
                      prefetch
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </li>

              <li className="elite-nav-item elite-has-dropdown">
                <Link href="/industries" className="elite-nav-link" prefetch>
                  Industries
                </Link>
                <div className="elite-dropdown elite-dropdown--industries">
                  <Link href="/industries" className="elite-dropdown-hub" prefetch>
                    Browse All Industries
                  </Link>
                  <div className="elite-dropdown-industry-grid">
                    {INDUSTRY_GROUPS.map((group) => (
                      <div key={group.label} className="elite-dropdown-section">
                        <div className="elite-dropdown-section-title">{group.label}</div>
                        {group.items.map((ind) => (
                          <Link key={ind.slug} href={`/industries/${ind.slug}`} prefetch>
                            {ind.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </li>

              <li className="elite-nav-item elite-has-dropdown">
                <Link href="/business-services" className="elite-nav-link" prefetch>
                  Business Services
                </Link>
                <div className="elite-dropdown">
                  {businessServicesMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={item.href === "/business-services" ? "elite-dropdown-hub" : ""}
                      prefetch
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </li>

              <li className="elite-nav-item elite-has-dropdown">
                <Link href="/state-loans" className="elite-nav-link" prefetch>
                  Resources
                </Link>
                <div className="elite-dropdown elite-dropdown--resources">
                  <Link href="/state-loans" className="elite-dropdown-hub" prefetch>
                    Funding by State
                  </Link>
                  <div className="elite-dropdown-section">
                    <div className="elite-dropdown-section-title">Featured States</div>
                    <div className="elite-dropdown-chip-grid">
                      {featuredStates.slice(0, 6).map((s) => (
                        <Link
                          key={s.slug}
                          href={`/state-loans/${s.slug}`}
                          className="elite-dropdown-chip"
                          prefetch
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="elite-dropdown-section">
                    <div className="elite-dropdown-section-title">More</div>
                    <Link href="/blog" prefetch>Blog</Link>
                    <Link href="/about-us" prefetch>About</Link>
                    <Link href="/contact" prefetch>Contact</Link>
                  </div>
                </div>
              </li>

            </ul>
          </nav>

          {/* Desktop CTA */}
          <Link href="/apply" className="elite-cta" prefetch>
            Apply Now
          </Link>

          {/* Mobile Toggle */}
          <button
            className={`elite-mobile-toggle ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <div className={`elite-mobile-menu ${mobileOpen ? "open" : ""}`}>

        {/* Primary CTA at top */}
        <Link href="/apply" className="elite-mobile-cta" onClick={closeMobile}>
          Apply Now &mdash; Free &amp; No Obligation
        </Link>

        <ul className="elite-mobile-nav-list">

          {/* Loan Programs */}
          <li className="elite-mobile-section">
            <div className="elite-mobile-section-row">
              <Link href="/loan-programs" className="elite-mobile-hub-link" onClick={closeMobile}>
                Loan Programs
              </Link>
              <button
                className={`elite-mobile-chevron ${openSection === "loans" ? "open" : ""}`}
                onClick={() => toggleSection("loans")}
                aria-label="Toggle loan programs"
              >
                &#8250;
              </button>
            </div>
            {openSection === "loans" && (
              <ul className="elite-mobile-submenu">
                {loanPrograms.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={closeMobile}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Industries */}
          <li className="elite-mobile-section">
            <div className="elite-mobile-section-row">
              <Link href="/industries" className="elite-mobile-hub-link" onClick={closeMobile}>
                Industries
              </Link>
              <button
                className={`elite-mobile-chevron ${openSection === "industries" ? "open" : ""}`}
                onClick={() => toggleSection("industries")}
                aria-label="Toggle industries"
              >
                &#8250;
              </button>
            </div>
            {openSection === "industries" && (
              <ul className="elite-mobile-submenu">
                {INDUSTRY_GROUPS.map((group) => (
                  <li key={group.label} className="elite-mobile-group">
                    <span className="elite-mobile-group-label">{group.label}</span>
                    <ul>
                      {group.items.map((ind) => (
                        <li key={ind.slug}>
                          <Link href={`/industries/${ind.slug}`} onClick={closeMobile}>
                            {ind.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Business Services */}
          <li className="elite-mobile-section">
            <div className="elite-mobile-section-row">
              <Link href="/business-services" className="elite-mobile-hub-link" onClick={closeMobile}>
                Business Services
              </Link>
              <button
                className={`elite-mobile-chevron ${openSection === "services" ? "open" : ""}`}
                onClick={() => toggleSection("services")}
                aria-label="Toggle business services"
              >
                &#8250;
              </button>
            </div>
            {openSection === "services" && (
              <ul className="elite-mobile-submenu">
                {businessServicesMenu.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={closeMobile}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Resources */}
          <li className="elite-mobile-section">
            <div className="elite-mobile-section-row">
              <Link href="/state-loans" className="elite-mobile-hub-link" onClick={closeMobile}>
                Resources
              </Link>
              <button
                className={`elite-mobile-chevron ${openSection === "resources" ? "open" : ""}`}
                onClick={() => toggleSection("resources")}
                aria-label="Toggle resources"
              >
                &#8250;
              </button>
            </div>
            {openSection === "resources" && (
              <ul className="elite-mobile-submenu">
                <li><Link href="/state-loans" onClick={closeMobile}>Funding by State</Link></li>
                <li><Link href="/blog" onClick={closeMobile}>Blog</Link></li>
                <li><Link href="/about-us" onClick={closeMobile}>About Us</Link></li>
                <li><Link href="/contact" onClick={closeMobile}>Contact</Link></li>
              </ul>
            )}
          </li>

          <li className="elite-mobile-direct">
            <Link href="/contact" onClick={closeMobile}>Contact Us</Link>
          </li>

        </ul>

        {/* Phone at bottom */}
        <a href="tel:18889008979" className="elite-mobile-phone" onClick={closeMobile}>
          (888) 900-8979
        </a>

      </div>

    </header>
  );
}
