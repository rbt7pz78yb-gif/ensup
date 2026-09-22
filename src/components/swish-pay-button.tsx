import type { ReactNode } from "react";
import {
  campaign,
  formatSek,
  isLikelyMobile,
  swishAppHref,
} from "@/lib/campaign";
import { markSwishIntent } from "@/lib/swish-thanks";
import { cn } from "@/lib/utils";

export function SwishPayButton({
  amount,
  className,
  children,
}: {
  amount?: number;
  className?: string;
  children?: ReactNode;
}) {
  const appUrl = swishAppHref(amount);

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    markSwishIntent(amount);
    if (!isLikelyMobile()) {
      e.preventDefault();
      document.getElementById("swish-qr")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    e.preventDefault();
    window.location.href = appUrl;
  }

  return (
    <a
      href={appUrl}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-14 w-full items-center justify-center rounded-md bg-gold px-6 text-lg font-semibold text-cta-fg transition hover:bg-gold-soft",
        className,
      )}
    >
      {children ?? `Swisha ${amount ? formatSek(amount) : campaign.name}`}
    </a>
  );
}
