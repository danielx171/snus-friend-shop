/**
 * Empty tin illustration — reusable across empty states.
 * Originally from the 404 page, now shared site-wide.
 */
export function EmptyTinSvg({ size = 150 }: { size?: number }) {
  const scale = size / 150;
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
      <circle cx="75" cy="75" r="68" stroke="#1e3a5f" strokeWidth="4" fill="hsl(220 16% 10%)" />
      <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
      {/* Inner tin floor */}
      <circle cx="75" cy="75" r="52" fill="hsl(220 14% 8%)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Subtle embossed ring inside */}
      <circle cx="75" cy="75" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" fill="none" />
      {/* Lid shadow arc — 3D depth hint */}
      <path
        d="M 20 75 A 55 55 0 0 1 40 30"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small center dot — emboss */}
      <circle cx="75" cy="75" r="3" fill="rgba(255,255,255,0.06)" />
      {/* "Empty" dashed circle to suggest missing pouches */}
      <circle
        cx="75"
        cy="75"
        r="30"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        strokeDasharray="6 8"
        fill="none"
      />
    </svg>
  );
}
