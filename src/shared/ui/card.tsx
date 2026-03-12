import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border border-[var(--line)] bg-[color-mix(in_oklab,var(--assistant-bubble)_86%,white)] shadow-[var(--shadow-soft)]",
        className,
      )}
      {...props}
    />
  );
}
