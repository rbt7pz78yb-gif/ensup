import { campaign } from "@/lib/campaign";
import { ButtonLink } from "@/components/ui/button-link";
import { SwishPayButton } from "@/components/swish-pay-button";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <img
        src={campaign.images.hero}
        alt="Ett klassiskt snapsglas i stearinljus, med en granruska."
        className="absolute inset-0 size-full object-cover object-[78%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/15" />
      <div className="relative wrap section-pad pb-16 pt-28 md:pb-24 md:pt-32">
        <img
          src={campaign.logos.rt71}
          alt="Round Table 71 Ljungby"
          className="h-24 w-24 object-contain md:h-28 md:w-28"
        />
        <p className="mt-5 font-display text-sm tracking-[0.28em] text-gold-soft">
          {campaign.clubShort} LJUNGBY
        </p>
        <h1 className="mt-3 font-display text-[18vw] leading-[0.85] tracking-[0.06em] text-fg sm:text-8xl md:text-9xl">
          SKÄNK EN SUP
        </h1>
        <p className="mt-4 max-w-xl text-xl text-fg md:text-2xl">{campaign.tagline}</p>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted md:text-lg">
          Vi i RT71 vill att äldre här i stan ska få höja ett glas i jul. En
          skål kan vi alltid lösa. Blir uppslutningen större kan det växa, men
          vi lovar inte mer än vi kan hålla.
        </p>
        <div className="mt-8 flex max-w-md flex-col gap-3 sm:max-w-sm">
          <SwishPayButton amount={50} />
          <ButtonLink href="#kampanjen" variant="ghost" className="w-full">
            Läs mer
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
