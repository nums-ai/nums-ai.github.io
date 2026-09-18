import type { Metadata } from "next";
import Homepage from "@/components/homepage/Homepage";

export const metadata: Metadata = {
  title: "Nums AI — From predictions To better decisions",
  description: "Meet Causilo, a pretrained foundation model for structured data. Classification and regression, without task-specific retraining.",
  openGraph: {
    title: "Nums AI — From predictions To better decisions",
    description: "Meet Causilo. A new foundation for the world's data.",
    type: "website", locale: "en_US",
  },
};

export default function Home() {
  return <Homepage locale="en" />;
}
