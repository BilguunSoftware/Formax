import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { Manrope, Sofia_Sans_Extra_Condensed, Unbounded } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import { bootScript } from "@/lib/motion";
import { organizationJsonLd } from "@/lib/seo";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const display = Sofia_Sans_Extra_Condensed({
  subsets: ["latin", "cyrillic"],
  weight: "variable",
  variable: "--font-sofia",
  display: "swap",
  fallback: ["Arial Narrow", "Segoe UI", "sans-serif"],
});

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: "variable",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

const accent = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: "variable",
  variable: "--font-unbounded",
  display: "swap",
  preload: false,
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      {
        url: siteConfig.seo.ogImage,
        alt: `${siteConfig.name} жишээ зураг`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.theme.background,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const theme = {
    "--fx-ink": siteConfig.theme.background,
    "--fx-panel": siteConfig.theme.secondary,
    "--fx-paper": siteConfig.theme.paper,
    "--fx-lime": siteConfig.theme.lime,
    "--fx-sage": siteConfig.theme.sage,
    "--fx-stone": siteConfig.theme.stone,
    "--fx-mist": siteConfig.theme.mist,
  } as CSSProperties;

  return (
    <html
      lang={siteConfig.language}
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${accent.variable} h-full antialiased`}
      style={theme}
    >
      <body className="min-h-full bg-ink text-paper">
        <Script id="formax-boot" strategy="beforeInteractive">
          {bootScript}
        </Script>
        {siteConfig.isRealBusiness ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
          />
        ) : null}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
