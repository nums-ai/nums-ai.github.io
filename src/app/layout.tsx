import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nums AI",
  description:
    "We build a foundation model for structured data. New predictions without starting from scratch.",
  keywords: [
    "Nums AI",
    "foundation model",
    "tabular AI",
    "prediction",
    "in-context learning",
  ],
  openGraph: {
    title: "Nums AI",
    description:
      "We build a foundation model for structured data. New predictions without starting from scratch.",
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
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <noscript>
          <p className="no-script-notice">Enable JavaScript to switch datasets and chart settings.</p>
        </noscript>
        {children}
      </body>
    </html>
  );
}
