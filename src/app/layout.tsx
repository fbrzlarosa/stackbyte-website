import GoogleAnalytics from "@/components/GoogleAnalytics";
import IubendaScript from "@/components/IubendaScript";
import PersonSchema from "@/components/PersonSchema";
import ResourceHints from "@/components/ResourceHints";
import SmoothScroll from "@/components/SmoothScroll";
import { BackgroundProvider } from "@/context/BackgroundContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["monospace"],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://stackbyte.dev"),
  title: {
    default: "Fabrizio La Rosa | Full Stack Developer & Software Architect",
    template: "%s | Stackbyte",
  },
  description:
    "Fabrizio La Rosa is a Full Stack Engineer and Software Architect with 15+ years of experience in crafting efficient, scalable digital solutions.",
  alternates: {
    canonical: "https://stackbyte.dev",
  },
  keywords: [
    "Full Stack Developer",
    "Software Engineer",
    "Web Development",
    "React",
    "Next.js",
    "Node.js",
    "DevOps",
    "Web3",
    "Blockchain",
    "Freelance Developer Italy",
  ],
  authors: [{ name: "Fabrizio La Rosa", url: "https://stackbyte.dev" }],
  creator: "Fabrizio La Rosa",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stackbyte.dev",
    title: "Fabrizio La Rosa | Full Stack Developer",
    description:
      "Turning complex problems into elegant, user-centric digital experiences. Expert in Websites, Backend, DevOps, and Web3.",
    siteName: "Stackbyte",
    images: [
      {
        url: "/og-image.jpg", // We need to generate or add this
        width: 1200,
        height: 630,
        alt: "Fabrizio La Rosa - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fabrizio La Rosa | Full Stack Developer",
    description: "Crafting efficient, scalable solutions in software & web.",
    creator: "@stackbyte", // Update with real handle if available
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <ResourceHints />
        <PersonSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden w-full`}
      >
        <BackgroundProvider>
          <IubendaScript />
          <GoogleAnalytics />
          <SmoothScroll>
            {children}
            <SpeedInsights />
            <Analytics />
          </SmoothScroll>
        </BackgroundProvider>
      </body>
    </html>
  );
}
