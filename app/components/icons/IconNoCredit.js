export default function IconNoCredit({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 6h16v12H4V6zm2 3h12v2H6V9z" />
      <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}