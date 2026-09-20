import type { ReactNode } from "react";
import { ExternalLink, Lock } from "lucide-react";
import { campaign, formatSek, swishQrSrc } from "@/lib/campaign";
import { useDonate } from "@/lib/donate-store";
import { ButtonLink } from "@/components/ui/button-link";
import { SwishPayButton } from "@/components/swish-pay-button";
import { cn } from "@/lib/utils";

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-display text-sm tracking-[0.28em] text-gold">{children}</p>;
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-3 font-display text-4xl tracking-[0.06em] text-fg md:text-6xl">{children}</h2>
  );
}

export function DonationSection() {
  const amount = useDonate((s) => s.amount);
  const setAmount = useDonate((s) => s.setAmount);

  return (
    <section id="skank" className="scroll-mt-16 border-t border-line bg-bg-2 py-16 md:py-24">
      <div className="wrap section-pad grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <Eyebrow>Swisha</Eyebrow>
          <Title>Skänk en sup</Title>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Välj en summa. I mobilen öppnas Swish. Vid datorn visar vi QR-koden.
            Nummer {campaign.swishNumberDisplay}, meddelande ”{campaign.swishMessage}”.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {campaign.amounts.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setAmount(a.value)}
                className={cn(
                  "min-h-16 rounded-md px-3 py-3 text-left outline outline-1 -outline-offset-1 transition",
                  amount === a.value
                    ? "bg-gold text-cta-fg outline-gold"
                    : "bg-surface text-fg outline-fg/10 hover:outline-fg/25",
                )}
              >
                <span className="block font-display text-2xl tracking-[0.06em]">{formatSek(a.value)}</span>
                <span className={cn("text-sm", amount === a.value ? "text-cta-fg/80" : "text-muted")}>
                  {a.label}
                </span>
              </button>
            ))}
          </div>
          <SwishPayButton amount={amount} className="mt-6" />
          <p className="mt-4 flex items-start gap-2 text-sm text-faint">
            <Lock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
            <span>
              Swish går till {campaign.club}. Nummer {campaign.swishNumberDisplay}.
              Meddelande: ”{campaign.swishMessage}”.
            </span>
          </p>
        </div>
        <div id="swish-qr" className="mx-auto w-full max-w-xs rounded-lg bg-fg p-5 text-center text-cta-fg">
          <img
            src={swishQrSrc(amount)}
            alt={`Swish QR för ${formatSek(amount)} till ${campaign.clubShort}.`}
            className="mx-auto aspect-square w-full bg-white object-contain"
          />
          <p className="mt-4 font-display text-xl tracking-[0.12em]">
            {campaign.swishNumberDisplay}
          </p>
          <p className="text-sm text-cta-fg/70">{formatSek(amount)} · {campaign.swishMessage}</p>
        </div>
      </div>
    </section>
  );
}

export function GoalSection() {
  return (
    <section id="mal" className="scroll-mt-16 py-16 md:py-24">
      <div className="wrap section-pad max-w-3xl">
        <Eyebrow>Målet</Eyebrow>
        <Title>Så många äldre som möjligt</Title>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            Vi vill nå så många äldre i Ljungby som möjligt med en julsnaps.
          </p>
          <p>
            Allt överskott går till välgörenhet, som vi har gjort i flera år
            med olika projekt.
          </p>
        </div>
      </div>
    </section>
  );
}

export function CampaignStory() {
  return (
    <section id="kampanjen" className="scroll-mt-16 border-t border-line bg-bg-2 py-16 md:py-24">
      <div className="wrap section-pad max-w-3xl">
        <Eyebrow>Om kampanjen</Eyebrow>
        <Title>En julsnaps</Title>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            En julskål för äldre i Ljungby. En traditionell snaps. Det är det
            här handlar om.
          </p>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="rt71" className="scroll-mt-16 border-t border-line py-16 md:py-24">
      <div className="wrap section-pad grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-16">
        <img
          src={campaign.logos.rt71}
          alt="Logotyp för Round Table 71 Ljungby."
          className="mx-auto h-44 w-44 object-contain md:h-56 md:w-56"
        />
        <div>
          <Eyebrow>Vilka är vi?</Eyebrow>
          <Title>Round Table 71 Ljungby</Title>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              Vi är Ljungbys Round Table-klubb. Män som träffas, umgås och
              hittar på saker. Framför allt för att det är kul att göra det
              tillsammans.
            </p>
            <p>
              Att göra något för andra hör till. Genom åren har vi haft flera
              välgörenhetsprojekt. I våras samlade vi in 10 000 kronor i
              klubben och skänkte till VeraS. Nu vill vi sätta guldkant på
              julen för äldre här i stan, och den här gången kan fler vara
              med.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RoundTableSwedenSection() {
  return (
    <section className="scroll-mt-16 border-t border-line bg-bg-2 py-16 md:py-24">
      <div className="wrap section-pad grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <Eyebrow>Round Table Sverige</Eyebrow>
          <Title>Upptaga. Anpassa. Förbättra.</Title>
          <p className="mt-2 font-display text-lg tracking-[0.18em] text-gold">
            Adopt. Adapt. Improve.
          </p>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              Round Table är Sveriges största nätverk för män mellan 18 och
              40. Ideell förening. Kring det runda bordet är alla lika.
            </p>
            <p>
              Kamratskapet kommer först. Välgörenhet är en stor del av
              arbetet. Bara det senaste året har klubbarna i Sverige samlat
              in över två miljoner kronor till nationella
              välgörenhetsinitiativ.
            </p>
            <p>
              På riksnivå har vi stöttat Min Stora Dag, som ger svårt sjuka
              barn en dag de minns. På senare år har vi samlats runt
              Movember, mot prostatacancer, testikelcancer och psykisk
              ohälsa hos män. Internationellt har klubbar byggt skolor och
              ställt upp efter katastrofer, bland annat efter tsunamin 2004.
            </p>
            <p>
              Skänk en sup är Ljungbys tur. Samma anda, här hemma.
            </p>
          </div>
          <ol className="mt-8 grid gap-3 sm:grid-cols-3">
            {campaign.motto.map((word, i) => (
              <li
                key={word}
                className="rounded-md bg-surface px-4 py-4 outline outline-1 -outline-offset-1 outline-fg/10"
              >
                <p className="font-display text-xs tracking-[0.22em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-display text-2xl tracking-[0.08em] text-fg">{word}</p>
              </li>
            ))}
          </ol>
          <ButtonLink
            href={campaign.roundTableSwedenUrl}
            variant="ghost"
            className="mt-8"
            target="_blank"
            rel="noreferrer"
          >
            Läs mer på roundtable.se
            <ExternalLink className="size-4" />
          </ButtonLink>
        </div>
        <img
          src={campaign.logos.rtSweden}
          alt="Logotyp för Round Table Sverige."
          className="mx-auto w-full max-w-md rounded-lg outline outline-1 -outline-offset-1 outline-fg/10"
        />
      </div>
    </section>
  );
}

export function LjungbySection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line">
      <img
        src={campaign.images.ljungby}
        alt="Storgatan i Ljungby."
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/40" />
      <div className="relative wrap section-pad py-24 md:py-36">
        <Eyebrow>Varför Ljungby?</Eyebrow>
        <h2 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] tracking-[0.04em] text-fg md:text-7xl">
          För folk som bor här
        </h2>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
          Pengarna stannar i Ljungby. Julen. Äldre. En skål. Inget mer krångligt
          än så.
        </p>
      </div>
    </section>
  );
}

export function MoneySection() {
  return (
    <section className="scroll-mt-16 border-t border-line py-16 md:py-24">
      <div className="wrap section-pad max-w-3xl">
        <Eyebrow>Öppenhet</Eyebrow>
        <Title>Vart går pengarna?</Title>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            Till en julsnaps för äldre i Ljungby.
          </p>
          <p>
            Allt överskott går till välgörenhet. Vi redovisar längs vägen.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="kontakt" className="scroll-mt-16 border-t border-line bg-bg-2 py-16 md:py-24">
      <div className="wrap section-pad max-w-3xl">
        <Eyebrow>Kontakt</Eyebrow>
        <Title>Vill du hjälpa till?</Title>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Swisha, sprid länken eller hör av dig till någon i RT71.
        </p>
        <p className="mt-4 text-sm text-faint">{campaign.siteHost}</p>
      </div>
    </section>
  );
}
