"use client";

export default function StaticHero() {
  return (

    <section className="static-hero full-bleed">
	  
      <div className="static-hero__inner">
        <div className="static-hero__overlay">
          <div className="static-hero__content">

            <h1>
			  Fast Small Business Loans<br />
			  <span className="hero-emphasis">
				Get Approved in 24–72 Hours
			  </span>
			</h1>

	  		<p className="static-hero__subhead">See what you qualify for in minutes — no impact to your credit. Compare multiple funding offers with one simple application.</p>
	  
	  		<div className="hero-micro-badge">
  				<span>✓ Funding available in all 50 states</span>
			</div>

	  		<div className="static-hero__actions">
  				<a href="/apply" className="btn-primary">
    				See My Funding Options
  				</a>
	  			<p className="static-hero__under">Takes under 2 minutes • ✓ No obligation • ✓ Soft credit review</p>
			</div> 
	
			<div className="lender-signal">
  				<span className="lender-signal-dot"></span>
  				<span>Nationwide private lending network</span>
			</div>

          </div>
        </div>
	  </div>
    </section>
  );
}