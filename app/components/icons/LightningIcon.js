export default function LightningIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M13 2L3 14h7v8l10-12h-7z" />
    </svg>
  );
}