interface IubendaConfig {
  cookiePolicyId: string;
  lang: string;
  storage?: {
    useSiteId?: boolean;
  };
  banner?: {
    acceptButtonDisplay?: boolean;
    customizeButtonDisplay?: boolean;
    position?: string;
    textColor?: string;
    backgroundColor?: string;
    acceptButtonColor?: string;
    acceptButtonCaptionColor?: string;
    customizeButtonColor?: string;
    customizeButtonCaptionColor?: string;
  };
  callback?: {
    onConsentGiven?: () => void;
    onConsentRejected?: () => void;
  };
}

type IubendaArray = Array<unknown> & {
  csConfiguration?: IubendaConfig;
  consentGiven?: boolean;
  getConsent?: (callback: (consent: boolean) => void) => void;
};

declare global {
  interface Window {
    _iub?: IubendaArray;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type { IubendaConfig, IubendaArray };

