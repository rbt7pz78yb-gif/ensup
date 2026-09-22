import { campaign } from "@/lib/campaign";

const KEY = "ensup-swish-intent";
const MIN_AWAY_MS = 4000;
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export type SwishIntent = {
  amount?: number;
  label: string;
  clickedAt: number;
  leftAt?: number;
};

export function amountLabel(amount?: number) {
  const preset = campaign.amounts.find((a) => a.value === amount);
  if (preset) return preset.label;
  if (amount) return `${amount} kr`;
  return "En sup";
}

export function thanksTitle(amount?: number) {
  if (amount === 20) return "Tack för supen!";
  if (amount === 100) return "Tack för rundan!";
  if (amount === 500) return "Tack för den rejäla skålen!";
  return "Tack för skålen!";
}

export function shareText(amount?: number) {
  const gift = amountLabel(amount).toLowerCase();
  return [
    `Jag har precis skänkt ${gift}.`,
    "",
    "Nu är det din tur.",
    "",
    `${campaign.tagline} Swisha 20, 50, 100 eller 500 kr till ${campaign.swishNumberDisplay}. Meddelande: ${campaign.swishMessage}.`,
    "",
    "Alkohol är frivilligt – det viktiga är skålen.",
    campaign.siteHost,
    "",
    "#skänkensup #ljungby #rt71",
  ].join("\n");
}

export function markSwishIntent(amount?: number) {
  if (typeof sessionStorage === "undefined") return;
  const intent: SwishIntent = {
    amount,
    label: amountLabel(amount),
    clickedAt: Date.now(),
  };
  sessionStorage.setItem(KEY, JSON.stringify(intent));
}

function readIntent(): SwishIntent | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SwishIntent;
  } catch {
    return null;
  }
}

export function markSwishLeft() {
  const intent = readIntent();
  if (!intent) return;
  if (Date.now() - intent.clickedAt > MAX_AGE_MS) {
    sessionStorage.removeItem(KEY);
    return;
  }
  sessionStorage.setItem(KEY, JSON.stringify({ ...intent, leftAt: Date.now() }));
}

export function consumeReturnedIntent(): SwishIntent | null {
  const intent = readIntent();
  if (!intent?.leftAt) return null;
  const away = Date.now() - intent.leftAt;
  const age = Date.now() - intent.clickedAt;
  if (away < MIN_AWAY_MS || age > MAX_AGE_MS) return null;
  sessionStorage.removeItem(KEY);
  return intent;
}

export async function copyShareText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const tmp = document.createElement("textarea");
    tmp.value = text;
    tmp.setAttribute("readonly", "");
    tmp.style.position = "fixed";
    tmp.style.left = "-9999px";
    document.body.appendChild(tmp);
    tmp.select();
    const ok = document.execCommand("copy");
    tmp.remove();
    return ok;
  }
}

export function tryOpenApp(appUrl: string, webUrl: string) {
  const started = Date.now();
  const timer = window.setTimeout(() => {
    if (document.visibilityState === "visible" && Date.now() - started < 1800) {
      window.location.href = webUrl;
    }
  }, 900);
  const cancel = () => window.clearTimeout(timer);
  window.addEventListener("pagehide", cancel, { once: true });
  window.addEventListener("blur", cancel, { once: true });
  window.location.href = appUrl;
}

export async function downloadCampaignImage() {
  const src = campaign.images.hero;
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skank-en-sup.jpg";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch {
    window.open(src, "_blank", "noopener,noreferrer");
  }
}
