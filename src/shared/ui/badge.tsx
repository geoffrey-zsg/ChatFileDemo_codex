import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--panel)] px-3 py-1 text-xs font-semibold text-[var(--muted)]",
        className,
      )}
      {...props}
    />
  );
}
