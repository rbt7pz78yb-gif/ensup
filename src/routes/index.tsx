import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import {
  AboutSection,
  CampaignStory,
  ContactSection,
  DonationSection,
  GoalSection,
  LjungbySection,
  MoneySection,
  RoundTableSwedenSection,
} from "@/components/campaign-sections";
import { SiteFooter } from "@/components/site-footer";
import { ThanksHost } from "@/components/thanks-dialog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <DonationSection />
        <GoalSection />
        <CampaignStory />
        <AboutSection />
        <RoundTableSwedenSection />
        <LjungbySection />
        <MoneySection />
        <ContactSection />
      </main>
      <SiteFooter />
      <ThanksHost />
    </>
  );
}
