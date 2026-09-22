import { useEffect, useId, useState } from "react";
import { Share2, X } from "lucide-react";
import { campaign } from "@/lib/campaign";
import { Button } from "@/components/ui/button-link";
import {
  consumeReturnedIntent,
  markSwishLeft,
  shareText,
  thanksTitle,
  type SwishIntent,
} from "@/lib/swish-thanks";

const TEST_INTENT: SwishIntent = {
  amount: 50,
  label: "En skål",
  clickedAt: Date.now(),
};

export function ThanksHost() {
  const [intent, setIntent] = useState<SwishIntent | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("tack") || params.has("dela")) {
      setIntent(TEST_INTENT);
      return;
    }

    const onLeave = () => markSwishLeft();
    const onReturn = () => {
      const next = consumeReturnedIntent();
      if (next) setIntent(next);
    };

    const onVisibility = () => {
      if (document.hidden) onLeave();
      else onReturn();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onLeave);
    window.addEventListener("pageshow", onReturn);
    window.addEventListener("focus", onReturn);
    onReturn();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onLeave);
      window.removeEventListener("pageshow", onReturn);
      window.removeEventListener("focus", onReturn);
    };
  }, []);

  return <ThanksDialog intent={intent} onClose={() => setIntent(null)} />;
}

function ThanksDialog({
  intent,
  onClose,
}: {
  intent: SwishIntent | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!intent) return;
    setCopied(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [intent, onClose]);

  if (!intent) return null;

  const url = campaign.siteUrl;
  const text = shareText(intent.amount);

  async function onShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.name,
          text,
          url,
        });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(true);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-3 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md overflow-hidden rounded-lg bg-surface outline outline-1 -outline-offset-1 outline-fg/15"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={campaign.images.hero}
          alt=""
          className="h-40 w-full object-cover object-[72%_center] sm:h-48"
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="font-display text-sm tracking-[0.28em] text-gold">{intent.label}</p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:text-fg"
              aria-label="Stäng"
            >
              <X className="size-5" />
            </button>
          </div>
          <h2 id={titleId} className="mt-2 font-display text-4xl tracking-[0.06em] text-fg sm:text-5xl">
            {thanksTitle(intent.amount)}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Du är med och skapar julstämning för en äldre Ljungbybo.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Vill du hjälpa oss att nå fler? Dela gärna.
          </p>
          <Button type="button" variant="gold" className="mt-6 w-full" onClick={onShare}>
            <Share2 className="size-4" aria-hidden />
            {copied ? "Kopierat" : "Dela"}
          </Button>
        </div>
      </div>
    </div>
  );
}
