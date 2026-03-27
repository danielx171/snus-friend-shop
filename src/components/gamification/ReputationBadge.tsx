import React from "react";
import { User, Shield, Star, Gem, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReputationBadgeProps {
  levelName: string;
  badgeColor: string;
  size?: "sm" | "md";
  className?: string;
}

interface TierConfig {
  Icon: React.ElementType;
  containerClass: string;
  iconClass: string;
}

const TIER_CONFIGS: Record<string, TierConfig> = {
  gray: {
    Icon: User,
    containerClass: "bg-[hsl(var(--color-tier-bronze)/0.2)] text-[hsl(var(--color-tier-bronze))] border-[hsl(var(--color-tier-bronze)/0.4)]",
    iconClass: "text-[hsl(var(--color-tier-bronze))]",
  },
  blue: {
    Icon: Shield,
    containerClass: "bg-[hsl(var(--color-tier-silver)/0.2)] text-[hsl(var(--color-tier-silver))] border-[hsl(var(--color-tier-silver)/0.4)]",
    iconClass: "text-[hsl(var(--color-tier-silver))]",
  },
  green: {
    Icon: Star,
    containerClass: "bg-[hsl(var(--color-tier-gold)/0.2)] text-[hsl(var(--color-tier-gold))] border-[hsl(var(--color-tier-gold)/0.4)]",
    iconClass: "text-[hsl(var(--color-tier-gold))]",
  },
  purple: {
    Icon: Gem,
    containerClass:
      "bg-[hsl(var(--color-tier-diamond)/0.2)] text-[hsl(var(--color-tier-diamond))] border-[hsl(var(--color-tier-diamond)/0.4)] shadow-[0_0_8px_hsl(var(--color-tier-diamond)/0.4)]",
    iconClass: "text-[hsl(var(--color-tier-diamond))]",
  },
  gold: {
    Icon: Crown,
    containerClass:
      "bg-[hsl(var(--color-tier-epic)/0.2)] text-[hsl(var(--color-tier-epic))] border-[hsl(var(--color-tier-epic)/0.4)] shadow-[0_0_8px_hsl(var(--color-tier-epic)/0.4)] animate-shimmer",
    iconClass: "text-[hsl(var(--color-tier-epic))]",
  },
};

export const ReputationBadge = React.memo(function ReputationBadge({
  levelName,
  badgeColor,
  size = "md",
  className,
}: ReputationBadgeProps) {
  if (!levelName) return null;

  const tier = TIER_CONFIGS[badgeColor] ?? TIER_CONFIGS.gray;
  const { Icon, containerClass, iconClass } = tier;

  const isSm = size === "sm";
  const iconSize = isSm ? 10 : 12;

  return (
    <span
      data-testid="rep-badge"
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        containerClass,
        isSm ? "px-1.5 py-0.5 gap-1 text-xs" : "px-2 py-1 gap-1.5 text-xs",
        className
      )}
    >
      <Icon className={iconClass} width={iconSize} height={iconSize} />
      {levelName}
    </span>
  );
});
