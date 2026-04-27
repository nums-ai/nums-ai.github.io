"use client";

import React, { useEffect, useRef, useState } from "react";

/* ── Scroll Reveal Hook ────────────────────── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const el = ref.current;
    if (el) {
      const targets = el.querySelectorAll("[data-reveal]");
      targets.forEach((t) => {
        (t as HTMLElement).style.opacity = "0";
        observer.observe(t);
      });
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ── Navbar ─────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(5, 5, 5, 0.8)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.06)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#hero"
          className="whitespace-nowrap text-lg font-semibold tracking-tight text-foreground"
        >
          Nums AI
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {[
            ["What We Do", "#what-we-do"],
            ["How It Works", "#how-it-works"],
            ["Use Cases", "#use-cases"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
          <a
            href="#cta"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
            style={{
              background: "var(--accent)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--accent)")
            }
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ───────────────────────────────────── */

function Hero() {
  return (
    <section
      id="hero"
      className="grid-pattern relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Radial gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99, 102, 241, 0.08), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1
          className="animate-fade-up text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          style={{ lineHeight: 1.05 }}
        >
          All You Need Is Your Spreadsheets
        </h1>

        <p className="animate-fade-up delay-200 mx-auto mt-6 text-lg font-light text-muted sm:text-xl">
          Turn your data into clear decisions.
        </p>
      </div>
    </section>
  );
}

/* ── What We Do ─────────────────────────────── */

const features = [
  {
    title: "Decision Making",
    description:
      "Get specific, data-backed recommendations — not just dashboards.",
  },
  {
    title: "Fast Integration",
    description:
      "Works with spreadsheets, databases, and existing tools. No infrastructure overhaul needed.",
  },
];

function WhatWeDo() {
  const ref = useScrollReveal();

  return (
    <section
      id="what-we-do"
      ref={ref}
      className="px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center" data-reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Capabilities
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            What We Do
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-reveal
              className={`delay-${(i + 1) * 100} group rounded-xl border p-8 transition-all duration-300 hover:-translate-y-1`}
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--card-border)")
              }
            >
              <h3 className="text-lg font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ───────────────────────────── */

const steps: { num: string; title: string; description: React.ReactNode }[] = [
  {
    num: "01",
    title: "Connect",
    description:
      "Point us to your data. CSV, database, API — we handle it all.",
  },
  {
    num: "02",
    title: "Analyze",
    description: (
      <>
        Our <span className="whitespace-nowrap">Large Tabular Model</span>{" "}
        finds patterns humans miss — in minutes.
      </>
    ),
  },
  {
    num: "03",
    title: "Act",
    description:
      "Know exactly what to do next — backed by your own data.",
  },
];

function HowItWorks() {
  const ref = useScrollReveal();

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center" data-reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Process
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3" data-reveal>
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div
                  className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 md:block"
                  style={{ background: "var(--card-border)" }}
                />
              )}

              <div className="relative">
                <span
                  className="text-5xl font-bold"
                  style={{ color: "var(--accent)", opacity: 0.3 }}
                >
                  {s.num}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Use Cases ──────────────────────────────── */

const useCases = [
  {
    industry: "E-Commerce",
    description: "Predict churn, optimize pricing, personalize recommendations",
  },
  {
    industry: "Finance",
    description: "Credit scoring, fraud detection, portfolio optimization",
  },
  {
    industry: "Manufacturing",
    description: "Demand forecasting, quality prediction, supply chain",
  },
  {
    industry: "Healthcare",
    description: "Patient risk assessment, resource allocation",
  },
  {
    industry: "Insurance",
    description: "Claims prediction, pricing optimization",
  },
  {
    industry: "Logistics",
    description: "Route optimization, demand planning",
  },
];

function UseCases() {
  const ref = useScrollReveal();

  return (
    <section
      id="use-cases"
      ref={ref}
      className="px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center" data-reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Industries
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Use Cases
          </h2>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc, i) => (
            <div
              key={uc.industry}
              data-reveal
              className={`delay-${(i + 1) * 100} rounded-xl border p-8 transition-all duration-300 hover:-translate-y-1`}
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--card-border)")
              }
            >
              <h3 className="text-base font-semibold text-foreground">
                {uc.industry}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ────────────────────────────────────── */

function CTA() {
  const ref = useScrollReveal();

  return (
    <section id="cta" ref={ref} className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div
          data-reveal
          className="glow-card relative overflow-hidden rounded-2xl border p-12 text-center sm:p-16"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Your data already has the answers.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Let&apos;s find them together.
          </p>
          <div className="mt-8">
            <a
              href="mailto:nums.ai.official@gmail.com"
              className="inline-block rounded-lg px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: "var(--accent)" }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────── */

function Footer() {
  return (
    <footer className="px-6 pb-12 pt-16">
      <div className="mx-auto max-w-6xl">
        <div
          className="mb-8 h-px w-full"
          style={{ background: "rgba(255, 255, 255, 0.06)" }}
        />
        <div className="flex flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p><span className="whitespace-nowrap">Nums AI</span> &copy; 2026</p>
          <div className="flex gap-6">
            <a
              href="mailto:nums.ai.official@gmail.com"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </a>
            <a
              href="#hero"
              className="transition-colors hover:text-foreground"
            >
              Back to Top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ───────────────────────────────────── */

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WhatWeDo />
      <HowItWorks />
      <UseCases />
      <CTA />
      <Footer />
    </main>
  );
}
