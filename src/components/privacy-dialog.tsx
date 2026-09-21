import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";

export function PrivacyLink({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Integritetspolicy
      </button>
      <PrivacyDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function PrivacyDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-3 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-lg bg-surface outline outline-1 -outline-offset-1 outline-fg/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <p className="font-display text-sm tracking-[0.28em] text-gold">RT71 Ljungby</p>
            <h2 id={titleId} className="mt-1 font-display text-3xl tracking-[0.06em] text-fg">
              Integritetspolicy
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:text-fg"
            aria-label="Stäng"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-4 overflow-y-auto px-6 pb-8 text-base leading-relaxed text-muted">
          <p>
            Vi värnar om din integritet och vill att du ska känna dig trygg när du
            kontaktar oss eller använder vår webbplats.
          </p>

          <h3 className="mt-6 font-display text-xl tracking-[0.08em] text-fg">
            Vilka personuppgifter samlar vi in?
          </h3>
          <p className="mt-2">
            När du använder vårt kontaktformulär kan vi samla in de uppgifter du
            själv väljer att lämna, exempelvis:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Namn</li>
            <li>E-postadress</li>
            <li>Telefonnummer, om du anger det</li>
            <li>Meddelande eller annan information som du skriver i formuläret</li>
          </ul>
          <p className="mt-3">
            Vi samlar endast in uppgifter som behövs för att kunna hantera din
            kontakt med oss.
          </p>

          <h3 className="mt-6 font-display text-xl tracking-[0.08em] text-fg">
            Vad använder vi uppgifterna till?
          </h3>
          <p className="mt-2">Vi använder uppgifterna för att:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Besvara frågor och meddelanden som skickas till oss</li>
            <li>Ha kontakt med personer som kontaktar organisationen</li>
            <li>Hantera och administrera vår verksamhet när det är nödvändigt</li>
          </ul>
          <p className="mt-3">Vi säljer inte dina personuppgifter till andra.</p>

          <h3 className="mt-6 font-display text-xl tracking-[0.08em] text-fg">
            Besöksstatistik
          </h3>
          <p className="mt-2">
            Vi räknar visningar med Vercel Analytics för att se hur sidan används.
            Den sätter inga cookies och samlar inte in namn, e-post eller andra
            uppgifter du skriver i formuläret.
          </p>

          <h3 className="mt-6 font-display text-xl tracking-[0.08em] text-fg">
            Hur länge sparar vi uppgifterna?
          </h3>
          <p className="mt-2">
            Vi sparar personuppgifter endast så länge som det är nödvändigt för
            det ändamål som uppgifterna samlades in för, eller så länge som vi är
            skyldiga att göra enligt lag.
          </p>

          <h3 className="mt-6 font-display text-xl tracking-[0.08em] text-fg">
            Vem har tillgång till uppgifterna?
          </h3>
          <p className="mt-2">
            Personuppgifter hanteras endast av personer inom organisationen eller
            av leverantörer som behöver uppgifterna för att tillhandahålla
            tjänster åt oss, exempelvis tjänsten som används för vårt
            kontaktformulär eller vår e-post.
          </p>

          <h3 className="mt-6 font-display text-xl tracking-[0.08em] text-fg">
            Dina rättigheter
          </h3>
          <p className="mt-2">
            Du har enligt dataskyddslagstiftningen vissa rättigheter när det
            gäller dina personuppgifter. Du kan bland annat ha rätt att få
            information om vilka uppgifter vi behandlar om dig och i vissa fall
            begära rättelse eller radering.
          </p>
          <p className="mt-3">
            Om du har frågor om hur vi hanterar personuppgifter är du välkommen
            att kontakta oss.
          </p>
        </div>
      </div>
    </div>
  );
}
