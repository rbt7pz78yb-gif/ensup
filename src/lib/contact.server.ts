const TO = "erik.richter@71-se.roundtable.world";

export async function deliverContact(input: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TO)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      _replyto: input.email,
      message: input.message,
      _subject: `Skänk en sup — meddelande från ${input.name}`,
      _template: "table",
      _captcha: "false",
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error("send_failed");
  }
}
