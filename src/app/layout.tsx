import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import Script from "next/script";
import Providers from "../providers/providers";
import "./globals.css";

const matter = localFont({
  src: [
    {
      path: "../../public/fonts/MatterRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/MatterMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/MatterSemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-matter",
});

const seasonMix = localFont({
  src: [
    {
      path: "../../public/fonts/SeasonMix-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SeasonMix-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-season",
});

export const metadata: Metadata = {
  title: "TrustLayer – Safe Payments for Private Deals",
  description: "Met on Marketplace, Instagram, or Discord? Send your transaction through TrustLayer. You make the deal, we protect it!",
  keywords: ["private deals", "safe payments", "marketplace security", "instagram trade", "discord trade", "buyer protection", "seller protection"],
  authors: [{ name: "TrustLayer Engineering" }],
  openGraph: {
    title: "TrustLayer – Safe Payments for Private Deals",
    description: "You found the deal. We make it safe. TrustLayer protects your transaction from fraud.",
    url: "https://trustlayer.com",
    siteName: "TrustLayer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustLayer – Safe Payments for Private Deals",
    description: "You found the deal. We make it safe. TrustLayer protects your transaction from fraud.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${matter.variable} ${seasonMix.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton invert />
        </Providers>
      </body>
    </html>
  );
}
