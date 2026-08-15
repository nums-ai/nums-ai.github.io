// Edit this file to change the Careers page copy.
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
    kicker: "Careers / Nums AI",
    title: "Build the future of prediction.",
    subtitle:
      "Join our first team expansion as we build a foundation model for tables and numbers.",
    cta: "Apply",
  },
  outline: {
    label: "Open positions",
    items: [
      ["00", "About Nums AI", "about"],
      ["01", "Machine Learning Engineer", "machine-learning-engineer"],
      ["02", "Business Development", "business-development"],
      ["03", "Open Application", "open-application"],
      ["04", "Working Conditions & Benefits", "conditions"],
      ["05", "How to Apply", "application"],
    ],
  },
  about: {
    title: "About Nums AI",
    paragraphs: [
      "Nums AI is an AI startup building a tabular foundation model (TFM) for tables and numbers. Our team combines world-class AI research expertise with the ambition to develop a global frontier model for numerical prediction.",
      "TFMs address a fundamental limitation of current predictive modeling: every new dataset and problem requires a separate model to be trained and tuned. A TFM, by contrast, is pretrained on millions of datasets, allowing one model to solve prediction problems across many domains. The same model can predict product defects, optimize logistics and inventory, improve pricing and marketing, support loan underwriting, and help manage patient health. TFMs already outperform predictive models that have been fully tuned for individual datasets, and we believe they will become the new standard for a wide range of prediction tasks.",
      "While many companies build AI products on third-party LLM APIs, we develop frontier models ourselves. We pretrain TFMs on millions of tables, test dozens of new ideas, and turn the strongest results into technology and products that can be used in the real world.",
      "We are looking for people to join us on this journey. You will help research, pretrain, deploy, and productize a global frontier model from end to end. Together, we aim to build a new kind of AI that can understand an entire company database and change how data-driven decisions are made.",
    ],
  },
  roleLabels: {
    responsibilities: "What you’ll do",
    qualifications: "What we’re looking for",
    preferred: "Nice to have",
  },
  roles: [
    {
      id: "machine-learning-engineer",
      title: "Machine Learning Engineer",
      introduction:
        "You will build the product systems that serve TFMs quickly and effectively. You’ll develop inference infrastructure that supports diverse data and deployment environments, then turn problems discovered with customers into better products and research.",
      responsibilities: [
        "Design and improve inference pipelines for pretrained TFMs.",
        "Extend TFMs to support a wider range of data and query types.",
        "Serve models through APIs, on-premises deployments, and other formats suited to each customer environment.",
        "Measure model quality and inference speed, and validate scalability, reliability, and usability.",
        "Study recurring customer needs and failure cases, then turn those insights into product capabilities.",
      ],
      qualifications: [
        "Experience developing models with a deep learning framework such as PyTorch.",
        "Strong Python skills and the ability to write testable, maintainable code.",
        "A solid understanding of machine learning training, inference pipelines, and data processing.",
        "The ability to analyze experiments systematically and implement reproducible results.",
        "The initiative to define ambiguous problems and see them through to a solution.",
      ],
      preferred: [
        "Experience with transformers, tabular models, graph neural networks, or in-context learning.",
        "Experience with distributed training, GPU profiling, or inference optimization.",
        "Experience building and operating model-serving systems, APIs, or data pipelines.",
        "Experience deploying machine learning systems in cloud or on-premises environments.",
        "Experience quickly understanding recent research and applying it to real systems.",
      ],
    },
    {
      id: "business-development",
      title: "Business Development",
      introduction:
        "You will connect our product with the market and solve real customer problems. You’ll develop a deep understanding of each customer’s data and workflows, define the right problem and goals, and design engagements that enable our TFM to deliver the best possible results.",
      responsibilities: [
        "Identify customers and use cases where TFMs can create value across manufacturing, finance, commerce, healthcare, and other industries.",
        "Develop a detailed understanding of customer workflows, core problems, budgets, decision structures, and adoption requirements.",
        "Structure customer problems into proofs of concept, defining goals, success criteria, timelines, and required resources.",
        "Coordinate with researchers and engineers to keep each proof of concept aligned with its goals and schedule.",
        "Translate customer feedback and sales insights into product direction and sales materials.",
      ],
      qualifications: [
        "A track record of delivering results in B2B sales, business development, consulting, or early-stage startup operations.",
        "The ability to quickly structure complex customer problems and turn them into clear plans of action.",
        "The ability to build trust across stakeholders and explain the value of technology in the customer’s language.",
        "A working understanding of data and machine learning, and the ability to collaborate effectively with researchers and engineers.",
        "The judgment and initiative to set priorities and execute without a predefined answer or process.",
      ],
      preferred: [
        "Experience building go-to-market functions from the ground up at an early-stage B2B AI or enterprise software company.",
        "Experience designing technical proofs of concept and converting them into paid engagements or long-term customers.",
        "Experience building CRMs, sales pipelines, proposals, sales materials, or customer operations processes.",
        "The ability to explore customer data directly with Python or SQL, or experience working with customers in English.",
      ],
    },
  ],
  openApplication: {
    id: "open-application",
    title: "Open Application",
    paragraphs: [
      "We welcome people who can define the role Nums AI needs next. There are no fixed requirements around title, experience, field of study, or credentials. Tell us about an important problem we may not have identified yet and why you are the right person to solve it. You can shape your proposal around the following questions:",
    ],
    bullets: [
      "What role do you believe Nums AI needs right now?",
      "What problem would you solve in that role, and what outcome would you aim to create?",
      "Why would you excel at this work, and what experience or body of work demonstrates that?",
      "What would you want to accomplish in your first three months?",
    ],
  },
  conditions: {
    id: "conditions",
    title: "Working Conditions & Benefits",
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
      "Send us your CV and a free-form cover letter. There are no restrictions on format or length.",
      "We will respond with an initial decision within five business days of receiving your application.",
      "Selected candidates will complete one or two interviews before a final hiring decision.",
    ],
  },
  footer: "© 2026 Nums AI Inc.",
} as const;
