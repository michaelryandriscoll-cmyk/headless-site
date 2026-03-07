export default function Hero() {
  return (
    <section className="sbc-hero-new">
      <div className="sbc-hero-new__inner">
        <div className="sbc-hero-new__left">
          <h1>Funding That Moves at the Speed of Your Business</h1>

          <p className="sbc-hero-new__subtitle">
            Flexible working capital and business financing—approved fast, with no hidden fees.
          </p>

          <div className="sbc-hero-new__actions">
            <a href="/apply" className="sbc-hero-new__btn">
              Get Funding →
            </a>

            <a href="/loan-programs" className="sbc-hero-new__link">
              See All Loan Options →
            </a>
          </div>
        </div>

        <div className="sbc-hero-new__right">
          <img
            src="/hero-illustration.png"
            alt="Business Funding Illustration"
            className="sbc-hero-new__image"
          />
        </div>
      </div>
    </section>
  );
}