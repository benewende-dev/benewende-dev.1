import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/components/currency-provider";
import SessionProvider from "@/components/session-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openbaara.com"),
  title: {
    default: "OpenBaara — Agence digitale · Web, App, IA Agentic & E-commerce",
    template: "%s | OpenBaara",
  },
  description:
    "OpenBaara (openbaara.com) est une agence digitale qui conçoit des sites web, applications mobiles, logiciels métier, agents IA et boutiques e-commerce. Formations, produits digitaux et accompagnement sur mesure depuis Ouagadougou.",
  keywords: [
    "agence digitale",
    "agence web Afrique",
    "création site internet",
    "e-commerce",
    "application mobile",
    "logiciel sur mesure",
    "IA agentic",
    "agent IA",
    "formation digital",
    "cours en ligne",
    "Burkina Faso",
    "Ouagadougou",
    "OpenBaara",
    "Benewende",
  ],
  authors: [{ name: "OpenBaara" }],
  creator: "OpenBaara",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://openbaara.com",
    siteName: "OpenBaara",
    title: "OpenBaara — Agence digitale · Web, App, IA Agentic & E-commerce",
    description:
      "Agence digitale full-stack : sites, apps, logiciels métier, agents IA, e-commerce, formations et produits digitaux.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenBaara — Agence digitale",
    description:
      "Web, App, Logiciel, IA Agentic, E-commerce et formations. On construit, on lance, on forme.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
