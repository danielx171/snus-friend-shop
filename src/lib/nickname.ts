/**
 * Generate a brand-themed nickname for users.
 * Two-part: [Brand Prefix] + [Title Suffix]
 * Examples: "ZYN Connoisseur", "VELO Veteran", "Loop Legend"
 *
 * Deterministic — same userId always produces the same nickname.
 */

// Popular brands first, then adjective-style fallbacks
const PREFIXES = [
  // Top brands
  'ZYN', 'VELO', 'Loop', 'Skruf', 'White Fox', 'Pablo', 'ICEBERG',
  'Siberia', 'Killa', 'Nordic', 'ACE', 'Helwit', 'Klint', 'FUMI',
  'Chainpop', 'RUSH', 'KUMA', 'Lyft', 'VID', 'ON!', 'Cuba',
  // Flavour/style inspired
  'Mint', 'Frost', 'Arctic', 'Ice', 'Berry', 'Citrus', 'Tropical',
  // Tone/mood
  'Shadow', 'Storm', 'Ember', 'Crimson', 'Golden', 'Iron',
  'Phantom', 'Titan', 'Apex', 'Ultra', 'Nitro', 'Mystic',
];

// Culture-forward suffixes — nicotine pouch enthusiast feel
const SUFFIXES = [
  'Connoisseur', 'Enthusiast', 'Aficionado', 'Devotee', 'Veteran',
  'Expert', 'Collector', 'Purist', 'Insider', 'Pioneer',
  'Legend', 'Champion', 'Warrior', 'Master', 'Ranger',
  'Maverick', 'Rebel', 'Nomad', 'Viper', 'Hawk',
  'King', 'Queen', 'Ace', 'Ninja', 'Sage',
  'Boss', 'Captain', 'Wolf', 'Phoenix', 'Dragon',
];

/**
 * Generate a deterministic nickname from a user ID.
 * Same user always gets the same nickname.
 */
export function generateNickname(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  }
  const prefixIdx = Math.abs(hash) % PREFIXES.length;
  const suffixIdx = Math.abs(hash >> 8) % SUFFIXES.length;
  return `${PREFIXES[prefixIdx]} ${SUFFIXES[suffixIdx]}`;
}

/**
 * Display name priority: user-set name → tier title → email local part → fantasy nickname
 */
export function getDisplayName(opts: {
  displayName?: string | null;
  tierName?: string | null;
  email?: string | null;
  userId: string;
}): string {
  if (opts.displayName?.trim()) return opts.displayName.trim();
  if (opts.tierName?.trim()) return opts.tierName.trim();
  if (opts.email) {
    const local = opts.email.split('@')[0];
    if (local && local.length > 1) {
      return local.charAt(0).toUpperCase() + local.slice(1);
    }
  }
  return generateNickname(opts.userId);
}
