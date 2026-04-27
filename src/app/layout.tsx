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
  title: "Nums AI — Turn Data Into Decisions",
  description:
    "Nums AI provides LTM (Large Tabular Model) based decision making services for businesses. AI-powered intelligence for e-commerce, finance, manufacturing, healthcare, and more.",
  keywords: [
    "AI",
    "large tabular model",
    "LTM",
    "business intelligence",
    "decision making",
    "machine learning",
    "data analytics",
  ],
  openGraph: {
    title: "Nums AI — Turn Data Into Decisions",
    description:
      "AI-powered business intelligence built on Large Tabular Models. From tables to decisions.",
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
