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
    campaign.siteUrl,
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

function ua() {
  return typeof navigator === "undefined" ? "" : navigator.userAgent;
}

export function isAndroid() {
  return /Android/i.test(ua());
}

export function isIOS() {
  return /iPhone|iPad|iPod/i.test(ua());
}

function tapLink(href: string) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function pokeScheme(schemeUrl: string) {
  try {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.display = "none";
    iframe.src = schemeUrl;
    document.body.appendChild(iframe);
    window.setTimeout(() => iframe.remove(), 1500);
  } catch {
    /* ignore */
  }
}

export function openInApp(appUrl: string, webUrl: string, androidUrl?: string) {
  if (isAndroid() && androidUrl) {
    pokeScheme(androidUrl);
    tapLink(webUrl);
    return;
  }
  if (isIOS() && appUrl !== webUrl) {
    pokeScheme(appUrl);
    tapLink(webUrl);
    return;
  }
  tapLink(webUrl);
}

export function facebookTargets(siteUrl: string) {
  const web = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
  return {
    web,
    ios: "fb://share",
    android: `intent://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}#Intent;scheme=https;package=com.facebook.katana;S.browser_fallback_url=${encodeURIComponent(web)};end`,
  };
}

export function linkedinTargets(text: string, siteUrl: string) {
  const composer = `https://www.linkedin.com/feed/?shareActive=true&mini=true&text=${encodeURIComponent(text)}`;
  return {
    web: composer,
    ios: `linkedin://shareArticle?mini=true&url=${encodeURIComponent(siteUrl)}&summary=${encodeURIComponent(text)}`,
    android: `intent://www.linkedin.com/feed/?shareActive=true&mini=true&text=${encodeURIComponent(text)}#Intent;scheme=https;package=com.linkedin.android;S.browser_fallback_url=${encodeURIComponent(composer)};end`,
  };
}

export function instagramTargets() {
  const web = "https://www.instagram.com/";
  return {
    web,
    ios: "instagram://app",
    android: `intent://www.instagram.com/#Intent;scheme=https;package=com.instagram.android;S.browser_fallback_url=${encodeURIComponent(web)};end`,
  };
}
