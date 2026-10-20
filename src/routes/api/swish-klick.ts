import { createFileRoute } from "@tanstack/react-router";

const HIT = "https://abacus.jasoncameron.dev/hit/ensup.se/rt71-swishknapp";

export const Route = createFileRoute("/api/swish-klick")({
  server: {
    handlers: {
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
