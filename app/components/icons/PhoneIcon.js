export default function PhoneIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.37 2.02.73 3.45a2 2 0 0 1-.45 1.88L8.09 10c1.1 2.27 3 4.26 5.28 5.31l1.05-1.32a2 2 0 0 1 1.9-.55c1.3.33 2.4.57 3.27.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}