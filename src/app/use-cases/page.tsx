import type { Metadata } from "next";
import UseCasesPage from "@/components/use-cases/UseCasesPage";

export const metadata: Metadata = {
  title: "Use Cases — Nums AI",
  description: "Explore TabArena datasets by domain and compare Causilo with tree-based models on classification and regression tasks.",
};

export default function UseCases() {
  return <UseCasesPage locale="en" />;
}
