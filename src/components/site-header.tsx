import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { campaign } from "@/lib/campaign";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button-link";
import { SwishPayButton } from "@/components/swish-pay-button";

const links = [
  { href: "#skank", label: "Swisha" },
  { href: "#mal", label: "Målet" },
  { href: "#kampanjen", label: "Om kampanjen" },
  { href: "#rt71", label: "RT71" },
  { href: "#kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition duration-200",
        scrolled || open
          ? "bg-bg/90 shadow-[0_0_0_1px_rgb(243_239_230_/_0.08)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="wrap section-pad flex h-14 items-center justify-between md:h-16">
        <a href="#top" className="flex min-h-11 items-center gap-2.5" aria-label="Skänk en sup, startsida">
          <img src={campaign.logos.rt71} alt="" className="h-11 w-11 object-contain md:h-12 md:w-12" />
          <span className="font-display text-xl leading-none tracking-[0.14em] text-fg md:text-2xl">
            SKÄNK EN SUP
          </span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Sektioner">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
          <SwishPayButton amount={50} className="ml-2 w-auto min-h-11 px-5 text-sm">
            Swisha 50 kr
          </SwishPayButton>
        </nav>
        <Button
          variant="ghost"
          className="px-3 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>
      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-bg lg:hidden">
        <nav className="section-pad wrap flex flex-col gap-1 py-4" aria-label="Mobilmeny">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex min-h-12 items-center text-lg text-fg"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
