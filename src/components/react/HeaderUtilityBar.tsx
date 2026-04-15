import HeaderCartButton from '@/components/react/HeaderCartButton';
import HeaderCompareBadge from '@/components/react/HeaderCompareBadge';
import HeaderPointsBadge from '@/components/react/HeaderPointsBadge';

export default function HeaderUtilityBar() {
  return (
    <div className="flex items-center gap-2" id="header-utility-bar">
      <HeaderCompareBadge />
      <HeaderPointsBadge />
      <HeaderCartButton />
    </div>
  );
}
