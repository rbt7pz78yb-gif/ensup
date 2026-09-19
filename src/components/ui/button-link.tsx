import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  gold:
    "bg-gold text-cta-fg hover:bg-gold-soft",
  ghost:
    "bg-transparent text-fg outline outline-1 -outline-offset-1 outline-fg/20 hover:outline-fg/40",
} as const;

export function Button({
  variant = "gold",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 font-semibold transition",
        size === "lg" && "min-h-14 px-8 text-lg",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "gold",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
