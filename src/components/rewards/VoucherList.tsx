import React, { useCallback } from 'react';
import { Percent, Package, Clock, CheckCircle, XCircle, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Voucher } from '@/hooks/useVouchers';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function expiryCountdown(expiresAt: string): string {
  const now = Date.now();
  const exp = new Date(expiresAt).getTime();
  const diff = exp - now;

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);

  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

function statusBadge(status: Voucher['status']) {
  switch (status) {
    case 'used':
      return (
        <Badge variant="secondary" className="gap-1 text-xs">
          <CheckCircle className="h-3 w-3" /> Used
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="destructive" className="gap-1 text-xs">
          <XCircle className="h-3 w-3" /> Expired
        </Badge>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Derive human-readable label from voucher type + value            */
/* ------------------------------------------------------------------ */

function voucherLabel(voucher: Voucher): string {
  switch (voucher.type) {
    case 'discount_pct': {
      const pct = typeof voucher.value?.percent === 'number' ? voucher.value.percent : '?';
      return `${pct}% Off Voucher`;
    }
    case 'free_product':
      return 'Free Can';
    case 'free_month':
      return 'Free Month!';
    default:
      return 'Reward Voucher';
  }
}

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface VoucherListProps {
  vouchers: Voucher[];
  onApply: (id: string) => void;
  onClaim: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  VoucherCard                                                       */
/* ------------------------------------------------------------------ */

const VoucherCard = React.memo(function VoucherCard({
  voucher,
  onApply,
  onClaim,
}: {
  voucher: Voucher;
  onApply: (id: string) => void;
  onClaim: (id: string) => void;
}) {
  const inactive = voucher.status !== 'active';
  const Icon = voucher.type === 'discount_pct' ? Percent : Package;

  const handleAction = useCallback(() => {
    if (voucher.type === 'discount_pct') {
      onApply(voucher.id);
    } else {
      onClaim(voucher.id);
    }
  }, [voucher.id, voucher.type, onApply, onClaim]);

  return (
    <Card className={`transition-opacity ${inactive ? 'opacity-50' : ''}`}>
      <CardContent className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            backgroundColor: voucher.type === 'discount_pct' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: voucher.type === 'discount_pct' ? '#10b981' : '#ef4444',
          }}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{voucherLabel(voucher)}</p>
          {voucher.status === 'active' && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" />
              {expiryCountdown(voucher.expires_at)}
            </p>
          )}
          {statusBadge(voucher.status)}
        </div>

        {/* Action */}
        {voucher.status === 'active' && (
          <Button
            size="sm"
            variant={voucher.type === 'discount_pct' ? 'default' : 'secondary'}
            onClick={handleAction}
            className="flex-shrink-0"
          >
            {voucher.type === 'discount_pct' ? 'Apply' : 'Claim'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

/* ------------------------------------------------------------------ */
/*  Main list                                                         */
/* ------------------------------------------------------------------ */

function VoucherListInner({ vouchers, onApply, onClaim }: VoucherListProps) {
  if (vouchers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Gift className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm font-semibold text-foreground mb-1">Your voucher pouch is empty</p>
        <p className="text-sm">Earn points to unlock discounts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vouchers.map((v) => (
        <VoucherCard key={v.id} voucher={v} onApply={onApply} onClaim={onClaim} />
      ))}
    </div>
  );
}

const VoucherList = React.memo(VoucherListInner);
export default VoucherList;
