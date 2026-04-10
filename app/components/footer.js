// app/components/footer.js
import Link from "next/link";
import "@/app/styles/footer.css";

export default function Footer() {
  return (
    <footer className="sbc-footer">
      <div className="sbc-footer__inner">

        {/* Top Section */}
        <div className="sbc-footer__grid">

          {/* Brand */}
          <div className="sbc-footer__col">
            <h4>Small Business Capital</h4>
            <p>Fast results. Trusted funding for American businesses.</p>

            <p className="sbc-footer__disclaimer">
              Small Business Capital is not a lender. We connect small business owners
              with third-party lenders and funding providers, including revenue-based
              financing and merchant cash advance programs. Loan approval, terms, and
              availability are determined solely by the lender.
            </p>

            <a className="sbc-footer-phone" href="tel:18889008979">
              (888) 900-8979
            </a>
          </div>

          {/* Loan Programs */}
          <div className="sbc-footer__col">
            <h4>Loan Programs</h4>
            <ul>
              <li>
                <a href="/loan-programs/working-capital-loans">
                  Working Capital
                </a>
              </li>
              <li>
                <a href="/loan-programs/equipment-financing">
                  Equipment Financing
                </a>
              </li>
              <li>
                <a href="/loan-programs/business-line-of-credit">
                  Business Line of Credit
                </a>
              </li>
              <li>
                <a href="/loan-programs/merchant-cash-advance">
                  Merchant Cash Advance
                </a>
              </li>
              <li>
                <a href="/loan-programs/term-loans">
                  Term Loans
                </a>
              </li>
              <li>
                <a href="/loan-programs/sba-loans">
                  SBA Loans
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="sbc-footer__col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/about-us">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/privacy-policy">Privacy</a>
              </li>
              <li>
                <a href="/terms-and-conditions">Terms</a>
              </li>
              <li>
                <a href="/sms-terms-conditions">SMS Terms</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="sbc-footer__col">
            <h4>Funding Speed</h4>
            <p>
              Funding in as fast as 24–72 hours.
              <br />
              One easy application.
            </p>
            <a className="sbc-footer-cta" href="/apply">
              Apply Now
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="sbc-footer__bottom">
          © {new Date().getFullYear()} Small Business Capital. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
