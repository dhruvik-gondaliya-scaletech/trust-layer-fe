import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "../providers/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustLayer – Safe Escrow for Private Deals",
  description: "Met on Marketplace, Instagram, or Discord? Send your transaction through TrustLayer. You make the deal, we protect it!",
  keywords: ["private deals", "safe escrow", "marketplace security", "instagram trade", "discord trade", "buyer protection", "seller protection"],
  authors: [{ name: "TrustLayer Engineering" }],
  openGraph: {
    title: "TrustLayer – Safe Escrow for Private Deals",
    description: "You found the deal. We make it safe. TrustLayer escrow protects your transaction from fraud.",
    url: "https://trustlayer.com",
    siteName: "TrustLayer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustLayer – Safe Escrow for Private Deals",
    description: "You found the deal. We make it safe. TrustLayer escrow protects your transaction from fraud.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="mobile-constraint">
            {children}
          </div>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
