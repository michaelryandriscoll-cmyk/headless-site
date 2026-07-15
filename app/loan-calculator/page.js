import LoanCalculatorClient from "./CalculatorClient";

export const metadata = {
  title: "Business Funding Estimator — Free Loan Calculator | Small Business Capital",
  description:
    "Estimate your business funding range and approval speed in seconds. Free, no-obligation calculator — checking your options doesn't affect your credit score.",
  alternates: {
    canonical: "https://smallbusiness.capital/loan-calculator",
  },
};

export default function LoanCalculatorPage() {
  return <LoanCalculatorClient />;
}
