"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function IubendaScript() {
  const policyId = process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID;

  useEffect(() => {
    // Initialize Iubenda configuration
    if (typeof window !== "undefined" && policyId) {
      (window as any)._iub = (window as any)._iub || [];
      (window as any)._iub.csConfiguration = {
        cookiePolicyId: policyId,
        siteId: policyId,
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
          acceptButtonColor: "#06B6D4",
          acceptButtonCaptionColor: "white",
          customizeButtonColor: "#161B22",
          customizeButtonCaptionColor: "#F3F4F6",
        },
      };
    }
  }, [policyId]);

  if (!policyId) {
    return null;
  }

  return (
    <>
      <Script
        id="iubenda-cs"
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="worker"
      />
    </>
  );
}
