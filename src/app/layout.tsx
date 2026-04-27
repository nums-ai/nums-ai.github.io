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
  title: "Nums AI — The foundation model that understands numbers",
  description:
    "Nums AI is building LTM (Large Tabular Model), a foundation model that predicts across industries — commerce, healthcare, finance, manufacturing, and defense. The ChatGPT moment for prediction hasn't happened yet. We're building it.",
  keywords: [
    "Nums AI",
    "LTM",
    "Large Tabular Model",
    "foundation model",
    "tabular AI",
    "tabular foundation model",
    "prediction",
    "in-context learning",
  ],
  openGraph: {
    title: "Nums AI — The foundation model that understands numbers",
    description:
      "LLMs reason in words. LTM reasons in numbers. The ChatGPT moment for prediction hasn't happened yet — we're building it.",
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
