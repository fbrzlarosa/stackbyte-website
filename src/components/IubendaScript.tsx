"use client";

import type { IubendaConfig } from "@/types/iubenda";
import Script from "next/script";
import { useEffect } from "react";

export default function IubendaScript() {
  const policyId = process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID;

  useEffect(() => {
    if (typeof window !== "undefined" && policyId) {
      window._iub = window._iub || [];
      const config: IubendaConfig = {
        cookiePolicyId: policyId,
        lang: "en",
        storage: {
          useSiteId: true,
        },
        banner: {
          acceptButtonDisplay: true,
          customizeButtonDisplay: true,
          position: "bottom",
          textColor: "#F3F4F6",
          backgroundColor: "#0D1117",
          acceptButtonColor: "var(--primary)",
          acceptButtonCaptionColor: "white",
          customizeButtonColor: "#161B22",
          customizeButtonCaptionColor: "#F3F4F6",
        },
        callback: {
          onConsentGiven: () => {
            const event = new CustomEvent("iubendaConsentGiven");
            window.dispatchEvent(event);
          },
          onConsentRejected: () => {
            const event = new CustomEvent("iubendaConsentRejected");
            window.dispatchEvent(event);
          },
        },
      };
      window._iub.csConfiguration = config;
    }
  }, [policyId]);

  if (!policyId) {
    return null;
  }

  return (
    <Script
      id="iubenda-cs"
      src="https://cdn.iubenda.com/cs/iubenda_cs.js"
      strategy="lazyOnload"
      onLoad={() => {
        if (typeof window !== "undefined" && window._iub) {
          window._iub.consentGiven = window._iub.consentGiven || false;
        }
      }}
    />
  );
}
