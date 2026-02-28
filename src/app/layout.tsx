import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "神秘占卜 - 周易算卦 · 答案之书 · 塔罗牌",
  description: "探索命运的奥秘，聆听宇宙的指引。提供周易六十四卦占卜、答案之书、塔罗牌占卜三种神秘占卜方式。",
  keywords: ["占卜", "算卦", "周易", "易经", "塔罗牌", "答案之书", "命运", "神秘学"],
  authors: [{ name: "神秘占卜" }],
  icons: {
    icon: "/tarot-icon.png",
  },
  openGraph: {
    title: "神秘占卜 - 探索命运的奥秘",
    description: "周易算卦 · 答案之书 · 塔罗牌占卜",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "神秘占卜",
    description: "探索命运的奥秘，聆听宇宙的指引",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
