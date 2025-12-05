"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) return;

    const checkConsent = () => {
      if (typeof window === "undefined" || !window._iub) {
        return;
      }

      try {
        if (window._iub.getConsent) {
          window._iub.getConsent((consent: boolean) => {
            setConsentGiven(consent);
          });
        } else if (window._iub.consentGiven === true) {
          setConsentGiven(true);
        }
      } catch (e) {
        console.error("Error checking Iubenda consent:", e);
      }
    };

    const handleConsentGiven = () => {
      setConsentGiven(true);
    };

    const handleConsentRejected = () => {
      setConsentGiven(false);
    };

    window.addEventListener("iubendaConsentGiven", handleConsentGiven);
    window.addEventListener("iubendaConsentRejected", handleConsentRejected);

    const interval = setInterval(checkConsent, 500);

    checkConsent();

    return () => {
      window.removeEventListener("iubendaConsentGiven", handleConsentGiven);
      window.removeEventListener(
        "iubendaConsentRejected",
        handleConsentRejected
      );
      clearInterval(interval);
    };
  }, [measurementId]);

  if (!measurementId || !consentGiven) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
