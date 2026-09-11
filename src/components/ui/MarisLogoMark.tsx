/**
 * Custom Minimalist Vector Logo Mark for MARIS:
 * An intersecting orbital radar arc and ocean wave compass crest
 */
export function MarisLogoMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 3" />
      <path
        d="M6 18C10 14 14 14 16 16C18 18 22 18 26 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 22C12 19 15 19 16 20C17 21 20 21 23 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="10" r="2.5" fill="currentColor" />
      <path d="M16 4V8M16 12V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
