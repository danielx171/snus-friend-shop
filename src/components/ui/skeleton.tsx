import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md bg-slate-700/50 skeleton-shimmer", className)}
      {...props}
    />
  );
}

export { Skeleton };
