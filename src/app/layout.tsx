import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nums AI — The Large Tabular Model",
  description:
    "LTM (Large Tabular Model) is a foundation model for tabular data. In-context learning. No training, no pipelines. Decisions in seconds.",
  keywords: [
    "AI",
    "large tabular model",
    "LTM",
    "foundation model",
    "tabular AI",
    "in-context learning",
    "decision making",
  ],
  openGraph: {
    title: "Nums AI — The Large Tabular Model",
    description:
      "LLMs read text. LTM reads tables. A foundation model for tabular data — no training, no pipelines, decisions in seconds.",
    type: "website",
    siteName: "Nums AI",
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
