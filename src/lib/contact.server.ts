const TO = "erik.richter@71-se.roundtable.world";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

export async function deliverContact(input: {
  name: string;
  email: string;
  message: string;
  phone?: string;
}) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TO)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": BROWSER_UA,
      Origin: "https://ensup.se",
      Referer: "https://ensup.se/",
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      telefon: input.phone || "—",
      _replyto: input.email,
      message: input.message,
      _subject: `Skänk en sup — meddelande från ${input.name}`,
      _template: "table",
      _captcha: "false",
    }),
    signal: AbortSignal.timeout(20000),
  });

  const text = await res.text();
  let body: { success?: boolean | string; message?: string } = {};
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    body = {};
  }
  const ok = body.success === true || body.success === "true";
  if (!res.ok || !ok) {
    const err = new Error(body.message || `send_failed_${res.status}`);
    err.name = res.status === 429 ? "RateLimited" : "SendFailed";
    throw err;
  }
}
