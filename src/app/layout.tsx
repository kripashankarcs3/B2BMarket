import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2e3fa3',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "B2BMarket — Wholesale direct from India's manufacturers",
    template: "%s · B2BMarket",
  },
  description:
    "Buy wholesale from GST-verified Indian manufacturers. Compare MOQ and bulk prices, request quotes, and order with GST invoices and tracked pan-India delivery.",
  keywords: [
    "B2B",
    "wholesale",
    "suppliers",
    "manufacturers",
    "India",
    "MSME",
    "bulk buying",
    "RFQ",
  ],
  openGraph: {
    title: "B2BMarket — Wholesale direct from India's manufacturers",
    description:
      "Buy wholesale from GST-verified Indian manufacturers. Compare MOQ and bulk prices, request quotes, and order with GST invoices.",
    type: "website",
    siteName: "B2BMarket",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-ink-900 focus:text-white focus:rounded-md"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
