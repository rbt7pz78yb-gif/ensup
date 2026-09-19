import { campaign } from "@/lib/campaign";

const links = [
  { href: "#kampanjen", label: "Om kampanjen" },
  { href: "#rt71", label: "RT71" },
  { href: campaign.roundTableSwedenUrl, label: "Round Table Sverige" },
  { href: "#kontakt", label: "Kontakt" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-24 pt-12 md:pb-12">
      <div className="wrap section-pad flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <img src={campaign.logos.rt71} alt="" className="h-14 w-14 object-contain" />
          <div>
            <p className="font-display text-2xl tracking-[0.12em] text-fg">SKÄNK EN SUP</p>
            <p className="text-sm text-muted">{campaign.tagline}</p>
            <p className="mt-1 text-sm text-faint">{campaign.siteHost}</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Sidfot">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="inline-flex min-h-11 items-center hover:text-fg"
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="wrap section-pad mt-10 text-sm text-faint">
        © {new Date().getFullYear()} {campaign.club}
      </p>
    </footer>
  );
}
