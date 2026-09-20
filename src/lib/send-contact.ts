import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(80).optional(),
});

export const sendContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };
    const { deliverContact } = await import("./contact.server");
    try {
      await deliverContact({
        name: data.name,
        email: data.email,
        message: data.message,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (/rate limit/i.test(msg) || (e instanceof Error && e.name === "RateLimited")) {
        throw new Error("RATE_LIMIT");
      }
      throw new Error("SEND_FAILED");
    }
    return { ok: true as const };
  });
