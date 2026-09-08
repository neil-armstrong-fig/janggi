# AGENTS.md

Janggi (Korean Chess) as an installable PWA. pnpm workspace, three packages:

| Package             | Contains                                                           |
| ------------------- | ------------------------------------------------------------------ |
| `webapp/`           | The React app. Vite, React 19, Redux Toolkit, Tailwind v4.         |
| `acceptance-tests/` | The acceptance-test DSL and specs, run by Playwright.              |
| `shared/`           | The janggi vocabulary, code shared by both, and base tool config.  |

`docs/` holds research that a decision in the code rests on — not API docs, and not anything the
code already says. Two so far:

- **`docs/opening-setups.md`** — the rules of janggi are not uniform on how a player's opening
  arrangement is named, and `setups/Setups.ts` had to pick a reading.
- **`docs/rules.md`** — how every piece moves, sourced from the Korea Janggi Association's own
  pages, plus the rules the engine does **not** implement yet. The endgame rules genuinely conflict
  between sources: bikjang and the pass move are described one way by both Wikipedias and another
  by the KJA's regulations, and each needs a decision rather than a guess.

Add a document here only when the reasoning is too long to sit in a comment and losing it would mean
someone re-deriving it; link it from the code it justifies.

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
pnpm test:properties     # the property tests, which `pnpm checks` leaves out
```

`pnpm checks` is the gate. It is `--max-warnings=0`, so a warning fails the build.

**`pnpm checks` deliberately leaves out the property tests.** A fresh seed every run means a
failure is not reproducible from the same commit, so it must not gate a deploy — it means "these
random games found something", which is worth investigating rather than blocking on.
`webapp/vitest.config.ts` excludes them and `webapp/vitest.properties.config.ts` runs only them, so
between the two every test file runs exactly once. Run them before finishing work in
`webapp/src/game/`.

## How work is done here

This project is Acceptance Test Driven. **Write the acceptance test first**, watch it fail for the
right reason, then make it pass. See `acceptance-tests/AGENTS.md`.

A unit test file is one-to-one with the single export it covers, and the filename already names that
export — so **do not wrap the file in a top-level `describe`**. Write `it(...)` at the top level and
let each name read as a sentence about the subject:

```ts
// BoardPositions.test.ts
it("covers the 90 intersections of 9 files and 10 ranks", () => {
```

`describe` is for grouping that earns itself — cases needing a different setup, or a genuine split
within one subject. A wrapper that only restates the filename is noise in every test report.

This governs unit tests only. Acceptance specs are the opposite case — their `given`/`when` nesting
is the specification rather than a restatement of the filename — so see `acceptance-tests/AGENTS.md`.

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

- **A filename is PascalCase and names its single export.** `StartingPieces.ts` exports
  `startingPieces`, `PieceAt.ts` exports `pieceAt`, `Board.tsx` exports `Board`. A React hook is no
  exception: `UseMoveSelection.ts` exports `useMoveSelection` — the file is named for what it
  exports, and the export keeps the lower-case `use` that React and its lint rules require. A test
  takes the name of its subject, so `UseMoveSelection.test.ts` sits beside it.

- **A file lives as close to its caller as it can, in a subdirectory of it.** A helper used by one
  component goes in a folder beneath that component, never beside it; something several siblings
  share rises to their nearest common ancestor and no further. Depth is the signal — it tells you a
  file's blast radius before you open it, and it is what stops a folder becoming a bag of loose
  parts. See `webapp/AGENTS.md` for the shape this produces.

- **A union of literals is read off the list, not written twice.** Where a type needs a runtime
  list of its own members — to iterate, or to validate a string against — declare the list `as
  const` and derive the type from it, so the two cannot drift apart.

  ```ts
  export const SETUP_NAMES = ["Inner Elephant", "Outer Elephant", "Left Elephant"] as const;

  export type SetupName = (typeof SETUP_NAMES)[number];
  ```

  Not this, where adding a member to one and forgetting the other compiles and is wrong:

  ```ts
  export type SetupName = "Inner Elephant" | "Outer Elephant" | "Left Elephant";
  export const SETUP_NAMES: readonly SetupName[] = ["Inner Elephant", "Outer Elephant"]; // silently short
  ```

  A union with no runtime list stays a plain `type` — `PieceKey` is a template literal over two
  other unions and has nothing to enumerate.

- **Give every type a name.** No inline object type or union in a signature, a field or a
  `Record`'s value — extract it and say what it is. `Record<Side, HomeRanks>` tells a reader what
  they are looking at; `Record<Side, {back: Rank; palace: Rank; ...}>` makes them parse it first.
  The exception is a component's own `Props`, which is already extracted by the rule below it.

- **A blank line between sibling JSX elements.** Two elements pressed together read as one block;
  a line between them makes the structure visible at a glance, and it matters more the longer the
  props get.

  ```tsx
  <svg>
    <PieceBody body={style.body} />

    {glyph.kind === "character" && <CharacterGlyph character={character} glyph={glyph} />}
  </svg>
  ```

  Prettier **preserves** these but will never add one, and nothing in the toolchain can insert them
  — `@eslint-react` is a correctness plugin with no stylistic rules, and the legacy
  `eslint-plugin-react` (which has `jsx-newline`) is deliberately not used. So this is on you.

- **Two conditionals rather than a ternary** when picking between JSX elements. A ternary forces a
  reader to hold both branches at once and gets worse as the props grow.

  ```tsx
  {glyph.kind === "character" && <CharacterGlyph ... />}

  {glyph.kind === "pictograph" && <Pictograph ... />}
  ```

  A discriminated union narrows correctly in each branch, so nothing is lost. A ternary is still
  right for a value — a class name, a colour — just not for choosing a component.

- A guard that tests the line directly above it can sit tight against it, with no blank line
  between — the two read as one thought, and the blank line implies a break that is not there.

  ```ts
  const pressed = this.picker.locator("[aria-pressed='true']");
  if ((await pressed.count()) === 0) return undefined;
  ```

  A preference, not a rule: it applies when the guard is about that one variable, and stops
  applying as soon as anything sits between them or the guard is about something else.

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
the `AGENTS.md` in each. Inside `webapp/` that layering is `react/` → `redux/` → `game/`, one way
only.

Flat config replaces a rule rather than merging it, so **never write `"no-restricted-imports"`
directly in an override** — call `restrictedImports({...})` from `shared/config/eslint.base.js`, or
the boundary is silently dropped for those files.

## More than one session may be running

Several agent sessions can be open on this working tree at once, and nothing tells you when another
one starts. Your own edit is the only thing you control — the working tree, the index, the stash and
the editor's language servers are all shared.

- **Re-read a file immediately before you change it.** Anything you read earlier may already be
  stale. It is also why a targeted edit beats rewriting a whole file: a rewrite silently reverts
  whatever landed in between.
- **Do not run a command that moves work you did not write.** `git stash`, `git checkout`/`restore`,
  `git reset`, `git read-tree`, `git clean`. `git stash` is the worst of them — it reverts the whole
  tree, and `stash pop` brings everything back unstaged, flattening a staging split someone was
  relying on.
- **Do not run repo-wide rewrites.** `pnpm format` and `pnpm lint:fix` rewrite every file in a
  package, so they sweep up another session's half-finished work and present it as your diff. Format
  the files you touched.
- **Reading is always safe** — `git status`, `git diff`, `pnpm lint`, `pnpm test`. But `git status`
  shows everyone's work, so do not report it as a description of yours.

To see what else is live:

```bash
pgrep -a claude
```

Each session is one line carrying `--permission-prompt-tool`. More than one and you are not alone —
ask first, naming the command you want to run and why.

## Ask before

- **Adding or upgrading any dependency.** Versions are exact-pinned, several deliberately (see
  below), and a `minimumReleaseAge` supply-chain policy rejects packages published in the last day.
- **Deleting or rebuilding `pnpm-lock.yaml`.** It re-resolves every transitive dependency.
- **Any git commit, branch or push.**
- **Any git command that writes to the index, the stash or the working tree.** See above.

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

`.github/workflows/property-tests.yml` runs the property tests on every push and pull request,
nightly, and on demand. It goes **red** on failure — a warning nobody sees is not worth running —
but gates nothing, because `deploy` needs only `checks` and `acceptance-tests`. A failure writes a
job summary naming what broke, the shrunk moves that broke it, and the seed to replay. **If branch
protection is ever turned on, leave this workflow out of the required checks**, or it becomes a gate
by the back door.

Pages serves under the repository name, so the deploy job rebuilds with
`BASE_PATH=/<repo>/`. That feeds Vite's `base` **and** the PWA manifest's `start_url`/`scope`. The
DSL navigates with `goto("./")` rather than `"/"` for the same reason — `"/"` resolves to the domain
root and would skip past the subpath.

## Tool configuration

All base config lives in `shared/config/` (`eslint.base.js`, `prettier.base.js`, `tsconfig.base.json`,
`vitest.base.ts`). Change a rule there, not in a package — packages extend it.

A package's `eslint.config.js` must call `baseConfig({tsconfigRootDir: import.meta.dirname, ...})`;
it throws otherwise. The editor runs one ESLint server for the whole workspace, so without an
explicit root the parser mixes up which package a file belongs to and reports every file as a
parsing error — while `pnpm lint`, one process per package, stays green.
