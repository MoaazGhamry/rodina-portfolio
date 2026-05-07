import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rodina Hany Shaheen | Visual Storyteller",
  description:
    "Freelance Video Editor & Photographer crafting cinematic stories and unforgettable moments with passion.",
  keywords: [
    "video editor",
    "photographer",
    "freelance",
    "cinematic",
    "lifestyle",
    "reels",
    "fashion",
  ],
  openGraph: {
    title: "Rodina Hany Shaheen | Visual Storyteller",
    description:
      "Freelance Video Editor & Photographer crafting cinematic stories with passion.",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rodina",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
