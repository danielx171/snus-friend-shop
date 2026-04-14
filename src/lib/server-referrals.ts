import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

export type ReferralValidationStatus = 'valid' | 'invalid' | 'unavailable';
export type ReferralRedeemStatus =
  | 'redeemed'
  | 'invalid'
  | 'already_redeemed'
  | 'self_referral'
  | 'not_requested'
  | 'unavailable';

interface ReferralRpcResult {
  success?: boolean;
  error?: string;
}

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

export function normalizeReferralCode(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? normalized : null;
}

export async function validateReferralCode(referralCode: string): Promise<ReferralValidationStatus> {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return 'unavailable';
  }

  const { data, error } = await adminClient
    .from('referral_codes')
    .select('id')
    .eq('code', referralCode)
    .maybeSingle();

  if (error) {
    console.error('validateReferralCode failed', { error: error.message, referralCode });
    return 'unavailable';
  }

  return data ? 'valid' : 'invalid';
}

export async function redeemReferralCodeForUser(
  referralCode: string,
  userId: string,
): Promise<ReferralRedeemStatus> {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return 'unavailable';
  }

  const { data, error } = await adminClient.rpc('redeem_referral_code', {
    p_code: referralCode,
    p_new_user_id: userId,
  });

  if (error) {
    console.error('redeemReferralCodeForUser failed', {
      error: error.message,
      referralCode,
      userId,
    });
    return 'unavailable';
  }

  const result = (data ?? {}) as ReferralRpcResult;

  if (result.success) {
    return 'redeemed';
  }

  switch (result.error) {
    case 'invalid_code':
      return 'invalid';
    case 'already_redeemed':
      return 'already_redeemed';
    case 'self_referral':
      return 'self_referral';
    default:
      return 'unavailable';
  }
}

function shouldClearPendingReferral(status: ReferralRedeemStatus): boolean {
  return status === 'redeemed'
    || status === 'invalid'
    || status === 'already_redeemed'
    || status === 'self_referral';
}

export async function clearPendingReferralCode(
  supabase: SupabaseClient,
  userMetadata: User['user_metadata'],
) {
  const nextMetadata: Record<string, unknown> = {
    ...((userMetadata ?? {}) as Record<string, unknown>),
    pending_referral_code: null,
  };
  await supabase.auth.updateUser({ data: nextMetadata });
}

export async function finalizePendingReferral(
  supabase: SupabaseClient,
  user: Pick<User, 'id' | 'user_metadata'>,
): Promise<ReferralRedeemStatus> {
  const referralCode = normalizeReferralCode(user.user_metadata?.pending_referral_code);

  if (!referralCode) {
    return 'not_requested';
  }

  const status = await redeemReferralCodeForUser(referralCode, user.id);

  if (shouldClearPendingReferral(status)) {
    try {
      await clearPendingReferralCode(supabase, user.user_metadata);
    } catch (error) {
      console.error('clearPendingReferralCode failed', {
        error: error instanceof Error ? error.message : String(error),
        userId: user.id,
      });
    }
  }

  return status;
}
