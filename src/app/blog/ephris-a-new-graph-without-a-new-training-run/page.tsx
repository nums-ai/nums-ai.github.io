import type { Metadata } from "next";
import Redirect from "./Redirect";

const destination = "/blog/ephris/";

export const metadata: Metadata = {
  title: "Ephris — Nums AI",
  alternates: { canonical: `https://nums.world${destination}` },
  robots: { index: false, follow: true },
};

export default function LegacyEphrisPage() {
  return (
    <main id="main">
      <meta httpEquiv="refresh" content={`5; url=${destination}`} />
      <Redirect destination={destination} />
      <p>This post has moved to <a href={destination}>/blog/ephris/</a>.</p>
    </main>
  );
}
