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
  return `Jag skänkte ${gift} till äldre i Ljungby. Skänk du också: ${campaign.siteUrl}`;
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
