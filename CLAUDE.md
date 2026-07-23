@AGENTS.md

# Guardrails

This repository is **public** — its code, commit history, and Actions logs are visible to anyone. Follow these rules.

## Never commit

- Credentials of any kind (in any file): API keys, tokens, passwords, private keys (`-----BEGIN ... PRIVATE KEY-----`), `.env`, service-account JSON. Keep `.gitignore` ignoring `.env*`, `*.pem`, etc.
- Sensitive data **in commit messages too**: personal/ops emails, internal URLs, private IPs, temporary tunnel URLs, references to unreleased internal docs, or unreleased product/strategy details.
- If something sensitive is committed by accident, rotate the value immediately and coordinate history cleanup with an admin. (A force-push does not guarantee removal — orphaned commits stay reachable by SHA; the only real defense is never committing them.)

## Site principles

- **Stay fully self-contained**: zero external requests. No external CDNs, web fonts, third-party scripts, or analytics/tracking. Embed images/icons/fonts (data URI / inline SVG / system fonts) or serve them from the same domain.
- Favicon must be **real files** (`favicon.ico` + `icon.png` + `apple-icon.png`). Safari ignores data-URI favicons.
- Serve logos and images as real files under `public/`, referenced from CSS as `/filename`.
- Preserve accessibility and responsiveness: mobile breakpoints, `prefers-reduced-motion`, aria attributes, the `<noscript>` fallback.

## Build & deploy

- Deploy: push to `main` → GitHub Actions → GitHub Pages. Keep `public/CNAME` once the custom domain is configured.
- Do not commit build output (`out/`, `.next/`) — they are gitignored.
- **Before deploying**: `npm run build` passes, all assets return 200 with correct content-type, favicon served as real files, no console errors, no horizontal scroll, zero external references.
- Force-push to `main` with care (it rewrites public history and re-triggers deploy).
