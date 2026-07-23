import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nums AI — Predicting the world through numbers",
  description:
    "A foundation model that predicts across every industry — in a single inference pass.",
  keywords: [
    "Nums AI",
    "foundation model",
    "tabular AI",
    "prediction",
    "in-context learning",
  ],
  openGraph: {
    title: "Nums AI — Predicting the world through numbers",
    description:
      "A foundation model that predicts across every industry — in a single inference pass.",
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
    <html lang="en" className="js">
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.feat .feat-icon{opacity:1!important;transform:none!important}.uc .uc-table .pred{opacity:1!important}.why-viz .link{stroke-dashoffset:0!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
