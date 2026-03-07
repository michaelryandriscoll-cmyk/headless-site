// app/lib/spinner.js
export function spinCityContent(cityName, stateName) {

  return {
    hero: `
      ${cityName}, ${stateName} business funding built for growth — compare lenders,
      credit lines, equipment loans and same-day working capital programs.
    `,

    intro: `
      Getting approved for a business loan in ${cityName} no longer requires a bank.
      Alternative lenders now offer same-day decisions, flexible repayment terms,
      and approvals based on revenue rather than collateral or FICO score.
      Below, you’ll find top funding options available in ${cityName}, ${stateName}.
    `,

    comparison: `
      Companies in ${cityName} secure financing for payroll, inventory expansion,
      equipment acquisition, fleet upgrades, and seasonal cash flow support.
      Most approvals in ${cityName}, ${stateName} fund within 24–72 hours.
    `,

    faq1: `
      How fast can I get funded in ${cityName}? — Many businesses receive funding
      within 1–3 business days once documents are verified.
    `,

    faq2: `
      What credit scores qualify? — Programs exist starting near 500+ depending
      on revenue strength, industry and time in business.
    `,

    faq3: `
      Do you require collateral? — Many working-capital programs are unsecured,
      relying on cash flow instead of real estate or equipment.
    `
  };
}// JavaScript Document