import * as React from "react";

import { cn } from "@/shared/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)] focus-visible:outline-[var(--brand)]",
  secondary:
    "bg-[color-mix(in_oklab,var(--panel)_55%,white)] text-[var(--foreground)] hover:bg-[var(--panel-strong)] focus-visible:outline-[var(--brand)]",
  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[var(--panel)] focus-visible:outline-[var(--brand)]",
  danger: "bg-[var(--danger)] text-white hover:opacity-90 focus-visible:outline-[var(--danger)]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
});
