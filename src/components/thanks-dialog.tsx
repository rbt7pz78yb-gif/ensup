import { useEffect, useId, useState } from "react";
import { Check, Copy, Facebook, Instagram, Linkedin, X } from "lucide-react";
import { campaign } from "@/lib/campaign";
import {
  consumeReturnedIntent,
  copyShareText,
  facebookShareUrl,
  isMobile,
  linkedinComposerUrl,
  markSwishLeft,
  openNew,
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
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!intent) return;
    setDraft(shareText(intent.amount));
    setCopied(false);
    setStatus("");
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

  async function copyDraft() {
    const ok = await copyShareText(draft);
    setCopied(ok);
    setStatus(ok ? "Texten är kopierad." : "Markera texten och kopiera manuellt.");
    return ok;
  }

  async function shareFacebook() {
    await copyDraft();
    setStatus("Öppnar Facebook. Klistra in texten ovanför länken.");
    openNew(facebookShareUrl(campaign.siteUrl));
  }

  async function shareLinkedIn() {
    setStatus("Öppnar LinkedIn med texten ifylld.");
    openNew(linkedinComposerUrl(draft));
  }

  async function shareInstagram() {
    await copyDraft();
    if (isMobile()) {
      setStatus("Texten är kopierad. Öppnar Instagram.");
      openNew("instagram://app");
    } else {
      setStatus("Texten är kopierad. Öppna Instagram i telefonen och klistra in.");
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
          alt="Kampanjbild: snapsglas i stearinljus"
          className="h-40 w-full object-cover sm:h-48"
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
          <p className="mt-3 text-base leading-relaxed text-muted">
            Jag har skänkt en sup. Nu är det din tur.
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <label className="text-sm text-muted" htmlFor="share-draft">
              Färdigt inlägg
            </label>
            <button
              type="button"
              onClick={copyDraft}
              className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-gold outline outline-1 -outline-offset-1 outline-gold/40"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Kopierad" : "Kopiera"}
            </button>
          </div>
          <textarea
            id="share-draft"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setCopied(false);
            }}
            className="mt-2 min-h-40 w-full resize-y rounded-md bg-bg px-3 py-3 text-sm leading-relaxed text-fg outline outline-1 -outline-offset-1 outline-fg/15"
          />
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={shareFacebook}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#1877f2] px-4 font-semibold text-white"
            >
              <Facebook className="size-4" aria-hidden />
              Facebook
            </button>
            <button
              type="button"
              onClick={shareInstagram}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[linear-gradient(135deg,#f58529,#dd2a7b_52%,#8134af)] px-4 font-semibold text-white sm:scale-105"
            >
              <Instagram className="size-4" aria-hidden />
              Instagram
            </button>
            <button
              type="button"
              onClick={shareLinkedIn}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0a66c2] px-4 font-semibold text-white"
            >
              <Linkedin className="size-4" aria-hidden />
              LinkedIn
            </button>
          </div>
          {status ? <p className="mt-3 text-sm leading-relaxed text-gold">{status}</p> : null}
        </div>
      </div>
    </div>
  );
}
