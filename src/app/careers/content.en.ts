// Shared Careers page copy. Job descriptions live in src/content/careers/*.md.
// Page structure and styling live in page.tsx and careers.module.css.

export const careersContentEn = {
  metadata: {
    title: "Careers — Nums AI",
    description:
      "Join Nums AI and help build a foundation model for tables and numbers.",
  },
  navigation: {
    home: "Home",
  },
  hero: {
    title: "Build the future of prediction",
    subtitle:
      "Join our team as we build a foundation model for tables and numbers.",
  },
  outline: {
    label: "On this page",
    positionsLabel: "Open Positions",
  },
  about: {
    title: "About Nums AI",
    paragraphs: [
      "Nums AI is an AI startup building a tabular foundation model (TFM) for tables and numbers. Our team combines world-class AI research expertise with the ambition to develop a global frontier model for numerical prediction.",
      "TFMs address a fundamental limitation of current predictive modeling: every new dataset and problem requires a separate model to be trained and tuned. A TFM, by contrast, is pretrained on millions of datasets, allowing one model to solve prediction problems across many domains. The same model can predict product defects, optimize logistics and inventory, improve pricing and marketing, support loan underwriting, and help manage patient health. TFMs already outperform predictive models that have been fully tuned for individual datasets, and we believe they will become the new standard for prediction.",
      "We develop frontier models ourselves. We pretrain TFMs on millions of tables, test dozens of new ideas, and turn the strongest results into technology and products that can be used in the real world.",
      "We are looking for people to join us on this journey. You will help research, pretrain, deploy, and productize a global frontier model from end to end. Together, we build a new kind of AI that can change how data-driven decisions are made.",
    ],
  },
  noOpenPositions: "There are no open positions at the moment. Please check back later.",
  conditions: {
    id: "conditions",
    title: "Working Conditions",
    paragraphs: [
      "Every position begins with a three-month contract. We see this as a valuable period of mutual evaluation: Nums AI can assess the fit, and you can decide whether Nums AI is the right team for you.",
    ],
    bullets: [
      "Our office is at FASTFIVE Gangnam 1, near Exit 4 of Gangnam Station in Seoul.",
      "We provide strong support for the GPU cloud resources and AI subscriptions needed to do your best work.",
      "Compensation, stock options, and other terms are open to discussion.",
    ],
  },
  application: {
    id: "application",
    title: "How to Apply",
    email: "hiring@nums.world",
    bullets: [
      "Send us a one-page CV. No cover letter is required.",
      "We will respond with an initial decision within five business days of receiving your application.",
      "Selected candidates will complete one or two interviews before a final hiring decision.",
    ],
  },
  footer: "© 2026 Nums AI Inc.",
} as const;
