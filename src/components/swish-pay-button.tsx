import type { ReactNode } from "react";
import {
  campaign,
  formatSek,
  isLikelyMobile,
  swishAppHref,
  swishHttpsHref,
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
  const httpsUrl = swishHttpsHref(amount);
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
    let framed = false;
    try {
      framed = Boolean(window.top && window.top !== window.self);
    } catch {
      framed = true;
    }
    if (framed) return;
    e.preventDefault();
    window.location.href = appUrl;
    window.setTimeout(() => {
      if (!document.hidden) window.location.href = httpsUrl;
    }, 700);
  }

  return (
    <a
      href={httpsUrl}
      target="_top"
      rel="noopener noreferrer"
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
