import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "B2BMarket — India's Premium B2B Marketplace",
  description:
    "Connect with verified Indian suppliers. Source premium products with AI-powered search, trade assurance, and seamless logistics. India's fastest growing B2B wholesale platform.",
  keywords: [
    "B2B",
    "marketplace",
    "wholesale",
    "suppliers",
    "India",
    "manufacturing",
    "trade",
    "MSME",
    "wholesale market",
  ],
  openGraph: {
    title: "B2BMarket — India's Premium B2B Marketplace",
    description:
      "Connect with verified Indian suppliers. Source premium products with AI-powered search, trade assurance, and seamless logistics.",
    type: "website",
    siteName: "B2BMarket",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
