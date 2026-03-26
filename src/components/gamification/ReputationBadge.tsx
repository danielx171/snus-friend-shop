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
    containerClass: "bg-gray-500/20 text-gray-400 border-gray-500/40",
    iconClass: "text-gray-400",
  },
  blue: {
    Icon: Shield,
    containerClass: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    iconClass: "text-blue-400",
  },
  green: {
    Icon: Star,
    containerClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    iconClass: "text-emerald-400",
  },
  purple: {
    Icon: Gem,
    containerClass:
      "bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.4)]",
    iconClass: "text-purple-400",
  },
  gold: {
    Icon: Crown,
    containerClass:
      "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_8px_rgba(251,191,36,0.4)] animate-shimmer",
    iconClass: "text-amber-400",
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
