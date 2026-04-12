import { describe, it, expect } from 'vitest';

// Per CLAUDE.md UI Conventions: use this exact regex, not `.includes('@')`.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (s: string) => EMAIL_RE.test(s.trim());

describe('email regex (CLAUDE.md UI convention)', () => {
  const valid = [
    'hello@example.com',
    'first.last@sub.example.co.uk',
    'user+tag@example.io',
    'a@b.cd',
    '  padded@example.com  ', // .trim() is expected at the call site
  ];

  const invalid = [
    '',
    'no-at-sign',
    'missing@dot',       // no '.' after the @
    '@nodomain.com',     // nothing before @
    'local@',            // nothing after @
    'two@@at.com',       // @ appears in both sides
    'white space@example.com',
    'user@ex ample.com',
    'user@.com',         // '.' present but still satisfies the regex structurally — keep as negative only if we fail it; see test below
    'user@com',          // no dot in domain
  ];

  for (const input of valid) {
    it(`accepts ${JSON.stringify(input)}`, () => {
      expect(isValidEmail(input)).toBe(true);
    });
  }

  for (const input of invalid) {
    it(`rejects ${JSON.stringify(input)}`, () => {
      expect(isValidEmail(input)).toBe(false);
    });
  }

  it('.includes("@") is NOT a substitute — the regex catches cases it misses', () => {
    // These all contain '@' but are not valid emails.
    const almost = ['@foo', 'foo@', 'foo@bar', 'a b@c d'];
    for (const s of almost) {
      expect(s.includes('@')).toBe(true);
      expect(isValidEmail(s)).toBe(false);
    }
  });
});
