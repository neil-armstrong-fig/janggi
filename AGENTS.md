# AGENTS.md

Janggi (Korean Chess) as an installable PWA. pnpm workspace, three packages:

| Package             | Contains                                                           |
| ------------------- | ------------------------------------------------------------------ |
| `webapp/`           | The React app. Vite, React 19, Redux Toolkit, Tailwind v4.         |
| `acceptance-tests/` | The acceptance-test DSL and specs, run by Playwright.              |
| `shared/`           | Code shared by both, and the base tool config in `shared/config/`. |

Each package has its own `AGENTS.md` — read the one for the package you are editing.

## Commands

While working — scoped to what you changed:

```bash
pnpm --filter @janggi/webapp exec eslint src/react/App.tsx
pnpm --filter @janggi/webapp exec vitest run src/redux
pnpm --filter @janggi/acceptance-tests exec playwright test src/tests/board/DefaultState.test.ts
```

Before finishing:

```bash
pnpm checks              # lint + format check + type check + unit tests, every package
pnpm format              # apply Prettier; fixes most format:check failures
pnpm lint:fix            # apply the ESLint fixes that are automatic
pnpm start               # dev server on http://localhost:3000
pnpm acceptance-tests    # needs `pnpm start` running in another terminal
pnpm install-browsers    # one-time Playwright chromium download
```

`pnpm checks` is the gate. It is `--max-warnings=0`, so a warning fails the build.

## How work is done here

This project is Acceptance Test Driven. **Write the acceptance test first**, watch it fail for the
right reason, then make it pass. See `acceptance-tests/AGENTS.md`.

## Code style

Prettier owns formatting — run `pnpm format` rather than hand-matching. What it will not tell you:

- **Declare functions below their callers**, so a file reads top to bottom. Helpers must be
  `function` declarations — an arrow `const` is in the temporal dead zone and cannot be used above
  its line.

  ```ts
  export const store = createStore(); // the API first

  function createStore(): AppStore {
    // ...the detail below it
  }
  ```

- **No `../` imports.** Use the `@src/*` alias, which each package maps to its own `src/`.
- **Explicit return types** on function declarations, and `import type` for type-only imports
  (`verbatimModuleSyntax` is on).
- Prefer a named `export function` over `export default`.

## Import boundaries

Enforced by ESLint (`no-restricted-imports`, built in `shared/config/eslint.base.js`), so a
violation fails `pnpm checks`:

| From                | May import                                                    |
| ------------------- | ------------------------------------------------------------- |
| `shared/`           | nothing else in the workspace — it is the bottom of the graph |
| `webapp/`           | itself and `@janggi/shared`                                   |
| `acceptance-tests/` | itself and `@janggi/shared`                                   |

A workspace package added later is **denied by default**; add it to `allowedPackages` in that
package's `eslint.config.js` to permit it. Packages also enforce their own internal layering — see
the `AGENTS.md` in each.

Flat config replaces a rule rather than merging it, so **never write `"no-restricted-imports"`
directly in an override** — call `restrictedImports({...})` from `shared/config/eslint.base.js`, or
the boundary is silently dropped for those files.

## Ask before

- **Adding or upgrading any dependency.** Versions are exact-pinned, several deliberately (see
  below), and a `minimumReleaseAge` supply-chain policy rejects packages published in the last day.
- **Deleting or rebuilding `pnpm-lock.yaml`.** It re-resolves every transitive dependency.
- **Any git commit, branch or push.**

## Gotchas that will waste your time

- **Do not upgrade TypeScript past 6.0.3.** TS 7's native compiler ships without a stable
  programmatic API, so `typescript-eslint` cannot read the AST and ESLint crashes on startup. The
  API is due in TS 7.1 — revisit then, not before.
- **Do not add `baseUrl` to a tsconfig.** TS 6 made it an error. `paths` already resolve relative to
  the tsconfig's own directory — Vite and Playwright both handle this.
- **`pnpm setup` is a built-in pnpm command**, not ours. The script is `pnpm install-browsers`.
- On Linux/WSL, Chromium needs system libraries once:
  `pnpm --filter @janggi/acceptance-tests exec playwright install-deps chromium` (needs sudo).
  Without them every acceptance test fails on browser launch with `libnspr4.so`.

## CI and deployment

`.github/workflows/ci.yml` runs `checks`, then `acceptance-tests` against a production build served
by `vite preview`, then deploys `main` to GitHub Pages. Deployment is gated on both.

Pages serves under the repository name, so the deploy job rebuilds with
`BASE_PATH=/<repo>/`. That feeds Vite's `base` **and** the PWA manifest's `start_url`/`scope`. The
DSL navigates with `goto("./")` rather than `"/"` for the same reason — `"/"` resolves to the domain
root and would skip past the subpath.

## Tool configuration

All base config lives in `shared/config/` (`eslint.base.js`, `prettier.base.js`, `tsconfig.base.json`,
`vitest.base.ts`). Change a rule there, not in a package — packages extend it.
