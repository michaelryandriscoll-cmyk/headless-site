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

          {/* Social */}
          <div className="sbc-footer__col">
            <h4>Social</h4>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              <a href="https://www.linkedin.com/company/smallbusiness-capital/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: "rgba(255,255,255,0.6)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.facebook.com/smallbusiness.capital.fb?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: "rgba(255,255,255,0.6)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="sbc-footer__bottom">
          <span>© {new Date().getFullYear()} Small Business Capital. All rights reserved.</span>
        </div>

      </div>
    </footer>
  );
}
