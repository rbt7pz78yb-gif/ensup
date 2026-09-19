export const campaign = {
  name: "Skänk en sup",
  tagline: "En julskål för äldre i Ljungby.",
  club: "Round Table 71 Ljungby",
  clubShort: "RT71",
  legalName: "ROUND TABLE NR 71",
  orgNumber: "802554-4324",
  siteUrl: "https://ensup.se",
  siteHost: "ensup.se",

  swishNumber: "1230183863",
  swishNumberDisplay: "123 018 38 63",
  swishMessage: "Skänk en sup",

  currentAmount: 0,

  amounts: [
    { value: 20, label: "En sup" },
    { value: 50, label: "En skål" },
    { value: 100, label: "En runda" },
    { value: 500, label: "En rejäl skål" },
  ] as const,

  instagramUrl: "",
  facebookUrl: "",
  roundTableSwedenUrl: "https://www.roundtable.se",
  contactEmail: "",
  motto: ["Upptaga", "Anpassa", "Förbättra"] as const,

  logos: {
    rt71: "/brand/rt71.png",
    rtSweden: "/brand/rt-sweden.jpg",
    swishQr: "/brand/swish/open.png",
  },
  images: {
    hero: "/hero-glass.jpg",
    heroWide: "/hero-wide.jpg",
    ljungby: "/ljungby-storgatan.jpg",
  },
} as const;

const PRESET_QR: Record<number, string> = {
  20: "/brand/swish/20.png",
  50: "/brand/swish/50.png",
  100: "/brand/swish/100.png",
  500: "/brand/swish/500.png",
};

export function formatSek(n: number) {
  return `${n} kr`;
}

export function swishQrSrc(amount?: number) {
  if (amount && PRESET_QR[amount]) return PRESET_QR[amount];
  return campaign.logos.swishQr;
}

export function swishHttpsHref(amount?: number) {
  const p = new URLSearchParams();
  p.set("sw", campaign.swishNumber);
  if (amount) p.set("amt", String(amount));
  p.set("msg", campaign.swishMessage);
  return `https://app.swish.nu/1/pay?${p.toString()}`;
}

export function swishAppHref(amount?: number) {
  const payload: Record<string, unknown> = {
    version: 1,
    payee: { value: campaign.swishNumber },
    message: { value: campaign.swishMessage },
  };
  if (amount) payload.amount = { value: amount };
  return `swish://payment?data=${encodeURIComponent(JSON.stringify(payload))}`;
}

export function isLikelyMobile() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export const hasSocial = false;

export function contactHref() {
  return campaign.contactEmail ? `mailto:${campaign.contactEmail}` : "#kontakt";
}
