"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./signup.module.css";
import type { SignupContent } from "./content.en";

const TERMS_VERSION = "2026-09";

type Status = "idle" | "sending" | "success" | "retry" | "rejected" | "network";

type SignupFormProps = {
  endpoint: string;
  content: SignupContent["form"];
};

export default function SignupForm({ endpoint, content }: SignupFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const data = new FormData(event.currentTarget);
    const field = (key: string) => String(data.get(key) ?? "").trim();
    const payload = {
      email: field("email"),
      name: field("name"),
      organization: field("organization"),
      use_case: field("use_case"),
      terms_version: TERMS_VERSION,
      website: field("website"),
    };

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 202) setStatus("success");
      else if (res.status === 429 || res.status >= 500) setStatus("retry");
      else setStatus("rejected");
    } catch {
      setStatus("network");
    }
  }

  if (status === "success") {
    return (
      <p className={styles.success} role="status">
        {content.success}
      </p>
    );
  }

  const message =
    status === "retry"
      ? content.retry
      : status === "rejected"
        ? content.rejected
        : status === "network"
          ? content.network
          : null;

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label htmlFor="signup-email">{content.email}</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby="signup-email-hint"
        />
        <span className={styles.hint} id="signup-email-hint">
          {content.emailHint}
        </span>
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-name">{content.name}</label>
        <input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="name"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-organization">
          {content.organization}
          <span className={styles.optional}>{content.optional}</span>
        </label>
        <input
          id="signup-organization"
          name="organization"
          type="text"
          autoComplete="organization"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-use-case">
          {content.useCase}
          <span className={styles.optional}>{content.optional}</span>
        </label>
        <input
          id="signup-use-case"
          name="use_case"
          type="text"
          maxLength={200}
          placeholder={content.useCasePlaceholder}
        />
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="signup-website">Website</label>
        <input
          id="signup-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className={styles.terms}>
        <input name="terms" type="checkbox" required />
        <span>
          {content.termsBefore}
          <Link href="/terms/">{content.termsLink}</Link>
          {content.termsAfter}
        </span>
      </label>

      {message ? (
        <p className={styles.notice} role="alert">
          {message}
        </p>
      ) : null}

      <button
        className={styles.submit}
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? content.submitting : content.submit}
      </button>
    </form>
  );
}
