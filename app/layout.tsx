import type { Metadata } from "next";
import { Geist_Mono, Inter, Inter_Tight } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Vedant Shukla", template: "%s · Vedant Shukla" },
  description: "Rust backend developer building low-latency systems and Web3 infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <MotionProvider>
          <div className="mx-auto w-full max-w-[640px] px-6 pt-16">
            <Navbar />
            <main className="pb-28">{children}</main>
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}