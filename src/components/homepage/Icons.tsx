export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"} />
    </svg>
  );
}

type Domain = "customers" | "finance" | "health" | "operations" | "science" | "pricing" | "people" | "software";

export function DomainIcon({ domain }: { domain: Domain }) {
  const shapes = {
    customers: <><circle cx="9" cy="8" r="3" /><path d="M3.5 21v-3a5.5 5.5 0 0 1 11 0v3M18 5.5a3 3 0 0 1 0 6M18 15a4.5 4.5 0 0 1 4.5 4.5V21" /></>,
    finance: <><path d="m3 9 10-6 10 6M4 10h18M4 23h18M5 20V13m5 7v-7m6 7v-7m5 7v-7" /><circle cx="13" cy="7" r=".6" fill="currentColor" stroke="none" /></>,
    health: <><path d="M3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 14-9 14S3 15 3 8Z" /><path d="M2 12h5l2-4 4 8 2-4h7" /></>,
    operations: <><rect x="3" y="4" width="20" height="18" rx="2" /><path d="M3 10h20M8 16h2m5 0h3M8 7h.01m3 0h.01" /><circle cx="10" cy="16" r="2" /><path d="m17 14 2 2-2 2" /></>,
    science: <><circle cx="13" cy="13" r="2" fill="currentColor" stroke="none" /><ellipse cx="13" cy="13" rx="11" ry="4.5" /><ellipse cx="13" cy="13" rx="11" ry="4.5" transform="rotate(60 13 13)" /><ellipse cx="13" cy="13" rx="11" ry="4.5" transform="rotate(120 13 13)" /></>,
    pricing: <><path d="M3 4h10l11 11-9 9L3 12Z" /><circle cx="8" cy="9" r="1.5" /><path d="m14 13 4 4" /></>,
    people: <><path d="m2 9 11-6 11 6-11 6Zm5 3v7c4 3 8 3 12 0v-7M24 10v9" /></>,
    software: <><path d="m13 2 9 4v7c0 5-5 8-9 11-4-3-9-6-9-11V6Z" /><path d="m10 9-3 4 3 4m6-8 3 4-3 4" /></>,
  };
  return <svg width="28" height="28" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[domain]}</svg>;
}
