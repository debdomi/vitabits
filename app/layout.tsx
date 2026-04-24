import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-5MSBY2Z5TY";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vitabits.hu"),
  title: "Vitabits — Új generációs gumivitamin. Csatlakozz a várólistához.",
  description:
    "A Vitabits modern gumivitamin: 50+ összetevő egyetlen ízletes formában. Csatlakozz a várólistához, és értesülj elsőként az indulásról.",
  keywords: ["gumivitamin", "várólista", "Vitabits", "grüni", "étrend-kiegészítő"],
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "https://vitabits.hu",
    siteName: "Vitabits",
    title: "Vitabits — Új generációs gumivitamin",
    description:
      "Csatlakozz a várólistához. Korai hozzáférés, exkluzív frissítések, spam nélkül.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Vitabits grüni — új generációs gumivitamin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitabits — Új generációs gumivitamin",
    description: "Csatlakozz a várólistához.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#80ED99",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" className={inter.variable}>
      <body className="min-h-dvh font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-brand-green focus:px-4 focus:py-2 focus:text-white"
        >
          Ugrás a fő tartalomhoz
        </a>
        {children}

        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
      </body>
    </html>
  );
}
