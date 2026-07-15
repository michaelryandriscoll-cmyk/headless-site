"use client";

import Script from "next/script";

/**
 * Reusable author/reviewer byline for E-E-A-T signals.
 * Renders a small credited-author block plus Person schema markup.
 * Drop into any content page (industry pages, loan-program pages, blog posts).
 */
export default function AuthorByline({ pageId = "" }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daniel Taberski",
    jobTitle: "Director of Business Development",
    worksFor: {
      "@type": "Organization",
      name: "Small Business Capital",
      url: "https://smallbusiness.capital",
    },
  };

  return (
    <div className="author-byline">
      <Script
        id={`author-schema-${pageId}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="author-byline__inner">
        <div className="author-byline__avatar" aria-hidden="true">DT</div>
        <div className="author-byline__text">
          <span className="author-byline__label">Reviewed by</span>{" "}
          <span className="author-byline__name">Daniel Taberski</span>,{" "}
          <span className="author-byline__title">Director of Business Development, Small Business Capital</span>
        </div>
      </div>
    </div>
  );
}
