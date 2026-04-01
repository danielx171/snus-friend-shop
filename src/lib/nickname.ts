/**
 * Generate a fun pouch-themed nickname for new users.
 * Two-part: [Brand/Adjective] + [Title]
 * Examples: "Cuba Warrior", "Frost Queen", "Nordic Legend"
 */

const PREFIXES = [
  // Brand-inspired
  'ZYN', 'VELO', 'Nordic', 'Arctic', 'Frost', 'Ice', 'Loop', 'Pablo',
  'Siberia', 'Cuba', 'Skruf', 'Killa', 'Mint', 'Berry', 'Citrus',
  // Adjective-style
  'Shadow', 'Storm', 'Crystal', 'Ember', 'Crimson', 'Golden', 'Silver',
  'Thunder', 'Iron', 'Cosmic', 'Mystic', 'Turbo', 'Hyper', 'Neo',
  'Apex', 'Prime', 'Ultra', 'Nitro', 'Phantom', 'Titan',
];

const SUFFIXES = [
  'King', 'Queen', 'Prince', 'Warrior', 'Legend', 'Master',
  'Explorer', 'Knight', 'Champion', 'Crusader', 'Sage', 'Ranger',
  'Hunter', 'Sentinel', 'Phoenix', 'Maverick', 'Captain', 'Ace',
  'Rider', 'Hawk', 'Wolf', 'Viper', 'Dragon', 'Bear',
  'Chief', 'Boss', 'Guru', 'Ninja', 'Rebel', 'Nomad',
];

/**
 * Generate a deterministic nickname from a user ID.
 * Same user always gets the same nickname.
 */
export function generateNickname(userId: string): string {
  // Simple hash from user ID for deterministic selection
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  }
  // Use absolute value and mod for index selection
  const prefixIdx = Math.abs(hash) % PREFIXES.length;
  const suffixIdx = Math.abs(hash >> 8) % SUFFIXES.length;

  return `${PREFIXES[prefixIdx]} ${SUFFIXES[suffixIdx]}`;
}
