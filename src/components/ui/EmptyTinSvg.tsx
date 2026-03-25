/**
 * Empty tin illustration — reusable across empty states.
 * Originally from the 404 page, now shared site-wide.
 * Uses CSS classes (tin-*) for theme-aware colors.
 */
export function EmptyTinSvg({ size = 150 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer tin ring */}
      <circle cx="75" cy="75" r="68" className="tin-ring tin-fill" strokeWidth="4" />
      <circle cx="75" cy="75" r="60" className="tin-highlight" strokeWidth="1.5" fill="none" />
      {/* Inner tin floor */}
      <circle cx="75" cy="75" r="52" className="tin-inner" strokeWidth="1" />
      {/* Subtle embossed ring inside */}
      <circle cx="75" cy="75" r="40" className="tin-emboss" strokeWidth="0.75" fill="none" />
      {/* Lid shadow arc — 3D depth hint */}
      <path
        d="M 20 75 A 55 55 0 0 1 40 30"
        className="tin-shadow"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small center dot — emboss */}
      <circle cx="75" cy="75" r="3" className="tin-dot" />
      {/* "Empty" dashed circle to suggest missing pouches */}
      <circle
        cx="75"
        cy="75"
        r="30"
        className="tin-dashed"
        strokeWidth="1"
        strokeDasharray="6 8"
        fill="none"
      />
    </svg>
  );
}
