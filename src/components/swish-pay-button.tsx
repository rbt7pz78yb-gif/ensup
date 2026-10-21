import { useEffect, useState, type ReactNode } from "react";
import { campaign, formatSek, isLikelyMobile, swishAppHref } from "@/lib/campaign";
import { markSwishIntent } from "@/lib/swish-thanks";
import { cn } from "@/lib/utils";

let clicks: number | null = null;
let loading = false;
const listeners = new Set<(n: number | null) => void>();

function publish(n: number | null) {
  clicks = n;
  listeners.forEach((listen) => listen(n));
}

function useSwishClicks() {
  const [n, setN] = useState<number | null>(clicks);

  useEffect(() => {
    listeners.add(setN);
    if (clicks == null && !loading) {
      loading = true;
      fetch("/api/swish-klick")
        .then((r) => r.json())
        .then((data: { value?: number }) => {
          publish(typeof data.value === "number" ? data.value : 0);
        })
        .catch(() => publish(clicks))
        .finally(() => {
          loading = false;
        });
    }
    return () => {
      listeners.delete(setN);
    };
  }, []);

  return n;
}

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
  const presses = useSwishClicks();
  const label = children ?? `Swisha ${amount ? formatSek(amount) : campaign.name}`;

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    markSwishIntent(amount);
    publish((clicks ?? 0) + 1);
    fetch("/api/swish-klick", { method: "POST", keepalive: true }).catch(() => {});
    if (!isLikelyMobile()) {
      e.preventDefault();
      document.getElementById("swish-qr")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  return (
    <a
      href={appUrl}
      onClick={onClick}
      aria-label={
        presses && presses > 0 ? `${typeof label === "string" ? label : "Swisha"}. ${presses} tryck.` : undefined
      }
      className={cn(
        "inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-gold px-6 text-lg font-semibold text-cta-fg transition hover:bg-gold-soft",
        className,
      )}
    >
      <span>{label}</span>
      {presses != null && presses > 0 ? (
        <span className="rounded-full bg-cta-fg/15 px-2 py-0.5 text-sm font-medium tabular-nums leading-none">
          {presses}
        </span>
      ) : null}
    </a>
  );
}
