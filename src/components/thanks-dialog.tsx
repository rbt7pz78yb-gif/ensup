import { useEffect, useId, useState } from "react";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";
import { campaign } from "@/lib/campaign";
import {
  consumeReturnedIntent,
  copyShareText,
  markSwishLeft,
  openShareWindow,
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
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!intent) return;
    setDraft(shareText(intent.amount));
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

  const url = campaign.siteUrl;

  async function shareFacebook() {
    await copyShareText(draft);
    setStatus("Texten är kopierad. Klistra in den i rutan ovanför länken på Facebook.");
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    );
  }

  async function shareLinkedIn() {
    openShareWindow(
      `https://www.linkedin.com/feed/?shareActive=true&mini=true&text=${encodeURIComponent(draft)}`,
    );
    setStatus("LinkedIn öppnas med texten ifylld.");
  }

  async function shareInstagram() {
    const copied = await copyShareText(draft);
    setStatus(
      copied
        ? "Kopierat. Öppna Instagram, skapa ett inlägg och klistra in."
        : "Markera texten ovan och kopiera den till Instagram.",
    );
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
          <label className="mt-4 block text-sm text-muted" htmlFor="share-draft">
            Färdigt inlägg
          </label>
          <textarea
            id="share-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
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
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[linear-gradient(135deg,#f58529,#dd2a7b_52%,#8134af)] px-4 font-semibold text-white shadow-[0_8px_20px_rgba(221,42,123,0.28)] sm:scale-105"
            >
              <Instagram className="size-4" aria-hidden />
              Kopiera
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
          <p className="mt-3 text-sm leading-relaxed text-muted">
            LinkedIn får texten ifylld. Facebook öppnar länken med kampanjkortet — klistra in texten ovanför. Instagram: kopiera och klistra in själv.
          </p>
        </div>
      </div>
    </div>
  );
}
