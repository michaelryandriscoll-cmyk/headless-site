export default function DualCTA({ title, body }) {
  return (
    <section className="dual-cta-section">
      <h2>{title}</h2>
      <p>{body}</p>

      <div className="dual-cta-buttons">
        <a href="/apply" className="cta-primary">
          Pre-Qualify • No Credit Impact
        </a>

        <a href="tel:18883657999" className="cta-secondary">
          Speak to Funding Advisor
        </a>
      </div>
    </section>
  );
}// JavaScript Document