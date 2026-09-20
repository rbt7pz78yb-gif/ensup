import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { sendContact } from "@/lib/send-contact";
import { Button } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

export function ContactDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setWebsite("");
    }
  }, [open]);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const payload = { name, email, phone, message, website };
    try {
      await sendContact({ data: payload });
      setStatus("sent");
      return;
    } catch {
      /* server blocked — try from the browser */
    }
    if (website) {
      setStatus("sent");
      return;
    }
    try {
      const to = `${["erik", "richter"].join(".")}@${["71-se", "roundtable", "world"].join(".")}`;
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          telefon: phone || "—",
          _replyto: email,
          message,
          _subject: `Skänk en sup — meddelande från ${name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const body = (await res.json()) as { success?: boolean | string };
      if (body.success === true || body.success === "true") {
        setStatus("sent");
        return;
      }
    } catch {
      /* fall through */
    }
    setStatus("error");
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
        className="w-full max-w-md rounded-lg bg-surface p-6 outline outline-1 -outline-offset-1 outline-fg/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm tracking-[0.28em] text-gold">Kontakt</p>
            <h2 id={titleId} className="mt-1 font-display text-3xl tracking-[0.06em] text-fg">
              Hör av dig
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-md text-muted hover:text-fg"
            aria-label="Stäng"
          >
            <X className="size-5" />
          </button>
        </div>

        {status === "sent" ? (
          <div className="mt-6">
            <p className="text-lg leading-relaxed text-fg">Tack. Vi hör av oss.</p>
            <Button type="button" className="mt-6 w-full" onClick={onClose}>
              Stäng
            </Button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-sm text-muted">Namn</span>
              <input
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted">Din e-post</span>
              <input
                required
                type="email"
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted">Telefon (valfritt)</span>
              <input
                type="tel"
                maxLength={30}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted">Meddelande</span>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={cn(fieldClass, "resize-y py-3")}
              />
            </label>
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <label>
                Webbplats
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>
            {status === "error" ? (
              <p className="text-sm text-gold-soft">
                Det gick inte att skicka just nu. Vänta en minut och försök igen.
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={status === "sending"}>
              {status === "sending" ? "Skickar…" : "Skicka"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

const fieldClass =
  "mt-1 min-h-12 w-full rounded-md bg-bg px-4 text-fg outline outline-1 -outline-offset-1 outline-fg/15 placeholder:text-faint focus:outline-gold";
