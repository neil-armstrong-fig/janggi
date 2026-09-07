# Janggi

Janggi (Korean Chess, 장기) in the browser — client-side React, installable as a PWA, built with
Acceptance Test Driven Development.

## What's here

pnpm workspace with three packages:

- **`webapp/`** — the React app. Vite, React, Redux Toolkit, Tailwind, PWA.
- **`acceptance-tests/`** — the acceptance-test DSL and the specs, run by Playwright.
- **`shared/`** — code shared by both, plus the base tool config in `shared/config/`.

## Getting started

```bash
corepack enable && nvm use
pnpm install
pnpm install-browsers    # one-time Playwright chromium download
pnpm start               # http://localhost:3000
```

```bash
pnpm checks              # lint, format, types and unit tests across every package
pnpm acceptance-tests    # with the app running in another terminal
```

## Working on it

`AGENTS.md` at the root, and one per package, carry the conventions and the gotchas — for coding
agents and for people. Start there.
