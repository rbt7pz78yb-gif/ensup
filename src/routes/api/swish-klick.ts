import { createFileRoute } from "@tanstack/react-router";

const HIT = "https://abacus.jasoncameron.dev/hit/ensup.se/rt71-swishknapp-nu";
const READ = "https://abacus.jasoncameron.dev/get/ensup.se/rt71-swishknapp-nu";

export const Route = createFileRoute("/api/swish-klick")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await fetch(READ, { signal: AbortSignal.timeout(4000) });
          if (!res.ok) return Response.json({ value: 0 });
          const data = (await res.json()) as { value?: number };
          const value = Number(data.value);
          return Response.json({ value: Number.isFinite(value) ? value : 0 });
        } catch {
          return Response.json({ value: 0 });
        }
      },
      POST: async () => {
        try {
          await fetch(HIT, { signal: AbortSignal.timeout(4000) });
        } catch {
          // Räkningen får aldrig stoppa Swish.
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
