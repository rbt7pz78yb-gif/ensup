import { useEffect, useId, useState } from "react";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";
import { campaign } from "@/lib/campaign";
import { Button } from "@/components/ui/button-link";
import {
  consumeReturnedIntent,
  markSwishLeft,
  shareText,
  thanksTitle,
  type SwishIntent,
} from "@/lib/swish-thanks";

export function ThanksHost() {
  const [intent, setIntent] = useState<SwishIntent | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    setCopied(false);
  }, [intent]);

  if (!intent) return null;

  const url = campaign.siteUrl;
  const text = shareText(intent.amount);
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function shareInstagram() {
    if (navigator.share) {
      try {
        await navigator.share({ title: campaign.name, text, url });
        return;
      } catch {
        /* cancelled */
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
        className="w-full max-w-md rounded-lg bg-surface p-6 outline outline-1 -outline-offset-1 outline-fg/15 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
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
          Nu kan du hjälpa oss att nå ännu fler.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button type="button" variant="gold" className="w-full" onClick={shareInstagram}>
            <Instagram className="size-4" aria-hidden />
            {copied ? "Länken är kopierad" : "Dela på Instagram"}
          </Button>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 font-semibold text-fg outline outline-1 -outline-offset-1 outline-fg/20 transition hover:outline-fg/40"
          >
            <Linkedin className="size-4" aria-hidden />
            Dela på LinkedIn
          </a>
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 font-semibold text-fg outline outline-1 -outline-offset-1 outline-fg/20 transition hover:outline-fg/40"
          >
            <Facebook className="size-4" aria-hidden />
            Dela på Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
