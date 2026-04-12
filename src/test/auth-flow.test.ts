import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * These schemas mirror src/actions/auth.ts. Kept inline so the test stays
 * decoupled from the Astro Action runtime — we're asserting the validation
 * surface, not the action handler.
 */

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  redirect: z.string().optional(),
});

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  ageVerified: z.literal('on', { errorMap: () => ({ message: 'You must confirm you are 18+' }) }),
  termsAccepted: z.literal('on', { errorMap: () => ({ message: 'You must accept the terms' }) }),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
});

describe('auth: login schema', () => {
  it('accepts a valid email + any non-empty password', () => {
    const ok = loginSchema.safeParse({ email: 'a@b.co', password: 'x' });
    expect(ok.success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const r = loginSchema.safeParse({ email: 'not-an-email', password: 'x' });
    expect(r.success).toBe(false);
  });

  it('rejects empty password', () => {
    const r = loginSchema.safeParse({ email: 'a@b.co', password: '' });
    expect(r.success).toBe(false);
  });
});

describe('auth: register schema', () => {
  const valid = {
    email: 'new@user.com',
    password: 'longenough',
    fullName: 'Jane Doe',
    ageVerified: 'on',
    termsAccepted: 'on',
  };

  it('accepts a complete valid submission', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects passwords shorter than 8 characters', () => {
    const r = registerSchema.safeParse({ ...valid, password: 'short' });
    expect(r.success).toBe(false);
  });

  it('rejects missing full name', () => {
    const r = registerSchema.safeParse({ ...valid, fullName: '' });
    expect(r.success).toBe(false);
  });

  it('rejects when the 18+ checkbox is not confirmed', () => {
    const r = registerSchema.safeParse({ ...valid, ageVerified: 'off' });
    expect(r.success).toBe(false);
  });

  it('rejects when the terms checkbox is not accepted', () => {
    const r = registerSchema.safeParse({ ...valid, termsAccepted: 'off' });
    expect(r.success).toBe(false);
  });
});

describe('auth: reset password schema', () => {
  it('accepts an 8+ char password with a non-empty confirmation', () => {
    expect(
      resetPasswordSchema.safeParse({ password: 'longenough', confirmPassword: 'longenough' }).success,
    ).toBe(true);
  });

  it('rejects a short password', () => {
    expect(
      resetPasswordSchema.safeParse({ password: 'short', confirmPassword: 'short' }).success,
    ).toBe(false);
  });
});
