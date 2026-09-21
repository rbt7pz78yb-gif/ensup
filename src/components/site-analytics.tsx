import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";

export function SiteAnalytics() {
  useEffect(() => {
    const start = Date.now();
    const send = () => {
      const seconds = Math.round((Date.now() - start) / 1000);
      if (seconds >= 3) track("tid_pa_sidan", { sekunder: seconds });
    };
    window.addEventListener("pagehide", send);
    return () => window.removeEventListener("pagehide", send);
  }, []);

  return <Analytics />;
}
