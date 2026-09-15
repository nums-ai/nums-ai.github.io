// Edit this file to change the sign-up page copy.
// Page structure and styling live in [locale]/page.tsx, SignupForm.tsx and signup.module.css.

export type SignupContent = {
  metadata: { title: string; description: string };
  navigation: { home: string };
  hero: { kicker: string; title: string; lead: string };
  form: {
    email: string;
    emailHint: string;
    name: string;
    organization: string;
    useCase: string;
    useCasePlaceholder: string;
    optional: string;
    termsBefore: string;
    termsLink: string;
    termsAfter: string;
    submit: string;
    submitting: string;
    success: string;
    retry: string;
    rejected: string;
    network: string;
  };
  tier: {
    title: string;
    rows: readonly (readonly [string, string])[];
    cellNote: string;
    commercialBefore: string;
    commercialEmail: string;
    commercialAfter: string;
  };
  footer: string;
};

export const signupContentEn: SignupContent = {
  metadata: {
    title: "Sign up — Nums AI",
    description:
      "Create a free Causilo API account. We email you a link that shows your API key once.",
  },
  navigation: {
    home: "Home",
  },
  hero: {
    kicker: "Causilo API / Sign up",
    title: "Get an API key.",
    lead: "Tell us where to send it. The free tier is enough to try Causilo on your own tables, and there is nothing to install on your side beyond the Python client.",
  },
  form: {
    email: "Email",
    emailHint: "The link to your key goes here.",
    name: "Name",
    organization: "Organization",
    useCase: "What you want to predict",
    useCasePlaceholder: "e.g. which customers churn next quarter",
    optional: "optional",
    termsBefore: "I have read and agree to the ",
    termsLink: "Terms of Service",
    termsAfter: ".",
    submit: "Request a key",
    submitting: "Sending…",
    success:
      "Check your inbox. We sent a link that will show your API key once.",
    retry:
      "We could not take the request just now. Please try again in a minute.",
    rejected:
      "The request was not accepted. Check the email address and try again.",
    network:
      "We could not reach the sign-up service. Please try again in a minute.",
  },
  tier: {
    title: "What a free account includes",
    rows: [
      ["Cells per month", "25,000,000"],
      ["Cells per day", "6,250,000"],
      ["Requests per minute", "60"],
    ],
    cellNote:
      "Cells are counted as rows times columns across the context and query tables of each request.",
    commercialBefore:
      "Commercial use beyond these limits is by agreement. Write to ",
    commercialEmail: "contact@nums.world",
    commercialAfter: " and tell us what you are running.",
  },
  footer: "© 2026 Nums AI Inc.",
};
