import { tenant } from '@/config/tenant';
import { siteHost } from '@/config/site';

type OgSvgOptions = {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly accent: string;
  readonly icon?: string;
};

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const renderOgSvg = ({
  eyebrow,
  title,
  subtitle,
  accent,
  icon = '•',
}: OgSvgOptions): string => `\
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c1018" />
      <stop offset="100%" stop-color="#161d2b" />
    </linearGradient>
    <radialGradient id="glow" cx="0%" cy="100%" r="90%">
      <stop offset="0%" stop-color="${escapeXml(accent)}" stop-opacity="0.28" />
      <stop offset="100%" stop-color="${escapeXml(accent)}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="0" y="0" width="1200" height="4" fill="${escapeXml(accent)}" />
  <circle cx="120" cy="560" r="260" fill="url(#glow)" />
  <circle cx="1040" cy="84" r="180" fill="${escapeXml(accent)}" opacity="0.10" />
  <rect x="60" y="170" width="88" height="88" rx="22" fill="${escapeXml(accent)}" opacity="0.14" />
  <text x="104" y="229" font-family="system-ui,sans-serif" font-size="44" font-weight="700" fill="${escapeXml(accent)}" text-anchor="middle">${escapeXml(icon)}</text>
  <text x="60" y="118" font-family="system-ui,sans-serif" font-size="16" font-weight="700" fill="#94a3b8" letter-spacing="4">${escapeXml(eyebrow.toUpperCase())}</text>
  <text x="170" y="230" font-family="system-ui,sans-serif" font-size="72" font-weight="800" fill="#e2e8f0">${escapeXml(title)}</text>
  <text x="170" y="290" font-family="system-ui,sans-serif" font-size="24" font-weight="400" fill="#94a3b8">${escapeXml(subtitle)}</text>
  <text x="60" y="560" font-family="system-ui,sans-serif" font-size="16" font-weight="600" fill="#cbd5e1">${escapeXml(tenant.name)}</text>
  <text x="1140" y="590" font-family="system-ui,sans-serif" font-size="16" font-weight="500" fill="#64748b" text-anchor="end">${escapeXml(siteHost)}</text>
</svg>
`;
