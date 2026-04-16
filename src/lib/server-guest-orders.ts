import { createClient } from '@supabase/supabase-js';
import { siteUrl } from '@/config/site';

type GuestOrderRow = {
  id: string;
  user_id: string | null;
  customer_email: string | null;
};

type GuestOrderLookupStatus = 'matched' | 'mismatch' | 'missing' | 'unavailable';
type GuestOrderClaimStatus = 'claimed' | 'already-linked' | 'mismatch' | 'missing' | 'unavailable';

function getSupabaseUrl(): string | null {
  return import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL ?? null;
}

function createAdminClient() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function normalizeGuestOrderEmail(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function getOrderEmail(row: Pick<GuestOrderRow, 'customer_email'>): string | null {
  return normalizeGuestOrderEmail(row.customer_email);
}

async function getGuestOrderRow(orderId: string): Promise<GuestOrderRow | null | 'unavailable'> {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return 'unavailable';
  }

  const { data, error } = await adminClient
    .from('orders')
    .select('id, user_id, customer_email')
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    console.error('getGuestOrderRow failed', {
      error: error.message,
      orderId,
    });
    return 'unavailable';
  }

  return (data ?? null) as GuestOrderRow | null;
}

export async function verifyGuestOrderEmail(
  orderId: string,
  email: string,
): Promise<GuestOrderLookupStatus> {
  const normalizedEmail = normalizeGuestOrderEmail(email);
  if (!normalizedEmail) {
    return 'mismatch';
  }

  const order = await getGuestOrderRow(orderId);
  if (order === 'unavailable') {
    return 'unavailable';
  }

  if (!order) {
    return 'missing';
  }

  return getOrderEmail(order) === normalizedEmail ? 'matched' : 'mismatch';
}

export async function claimGuestOrderForUser(
  orderId: string,
  userId: string,
  email: string,
): Promise<GuestOrderClaimStatus> {
  const normalizedEmail = normalizeGuestOrderEmail(email);
  if (!normalizedEmail) {
    return 'mismatch';
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return 'unavailable';
  }

  const order = await getGuestOrderRow(orderId);
  if (order === 'unavailable') {
    return 'unavailable';
  }

  if (!order) {
    return 'missing';
  }

  if (getOrderEmail(order) !== normalizedEmail) {
    return 'mismatch';
  }

  if (order.user_id === userId) {
    return 'already-linked';
  }

  if (order.user_id && order.user_id !== userId) {
    return 'mismatch';
  }

  const { error } = await adminClient
    .from('orders')
    .update({ user_id: userId })
    .eq('id', order.id)
    .is('user_id', null);

  if (error) {
    console.error('claimGuestOrderForUser failed', {
      error: error.message,
      orderId,
      userId,
    });
    return 'unavailable';
  }

  return 'claimed';
}

export function buildGuestOrderConfirmRedirect(
  siteUrl: string,
  orderId: string,
  email: string,
): string {
  const normalizedEmail = normalizeGuestOrderEmail(email) ?? email;
  const next = `/order-confirmation?order=${encodeURIComponent(orderId)}&email=${encodeURIComponent(normalizedEmail)}`;
  return `${siteUrl}/auth/confirm?next=${encodeURIComponent(next)}`;
}

export function extractGuestOrderIdFromNext(next: string | null | undefined): string | null {
  if (!next) {
    return null;
  }

  try {
    const target = new URL(next, siteUrl);
    if (target.pathname !== '/order-confirmation') {
      return null;
    }

    const orderId = target.searchParams.get('order')?.trim();
    return orderId ? orderId : null;
  } catch {
    return null;
  }
}

export function getGuestAccountErrorMessage(error: { code?: string; message?: string } | null | undefined): string {
  switch (error?.code) {
    case 'email_exists':
    case 'identity_already_exists':
    case 'user_already_exists':
      return 'That email already has an account. Log in to view your order.';
    case 'weak_password':
      return 'Please choose a stronger password with at least 8 characters.';
    case 'email_address_invalid':
      return 'Please use the same valid email address you entered at checkout.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Please wait about a minute before trying again.';
    default:
      return "We couldn't create your account right now. Please try again.";
  }
}
