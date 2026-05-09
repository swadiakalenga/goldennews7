import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GoldenNews7 — L'information africaine sans frontières",
    template: "%s | GoldenNews7",
  },
  description:
    "GoldenNews7 est votre source de référence pour l'actualité africaine et internationale : politique, économie, sécurité, sport, culture et bien plus.",
  keywords: [
    "actualité africaine",
    "news Afrique",
    "politique",
    "économie",
    "sécurité",
    "GoldenNews7",
  ],
  authors: [{ name: "GoldenNews7" }],
  creator: "GoldenNews7",
  publisher: "GoldenNews7",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "GoldenNews7",
    title: "GoldenNews7 — L'information africaine sans frontières",
    description:
      "Actualité africaine et internationale en continu : politique, économie, sécurité, sport, culture.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoldenNews7",
    description: "L'information africaine sans frontières",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
