# AGENTS.md

Janggi (Korean Chess) as an installable PWA. pnpm workspace, three packages:

| Package             | Contains                                                           |
| ------------------- | --------------------------------------------------------------------- |
| `webapp/`           | The React app. Vite, React 19, Redux Toolkit, Tailwind v4.         |
| `acceptance-tests/` | The acceptance-test DSL and specs, run by Playwright.              |
| `shared/`           | The janggi vocabulary, code shared by both, and base tool config.  |

Each has its own `AGENTS.md`, and webapp has one per subfolder besides.

`docs/` holds research a decision in the code rests on, linked from the code it justifies:
`docs/opening-setups.md`, `docs/rules.md`, `docs/bot.md`. Add a document here only when losing the
reasoning would mean someone re-deriving it.

## Before changing code

1. Identify every package in scope and read each applicable package `AGENTS.md` in full before
   planning — root, package, and any nested one on the path to the file you're editing.
2. Inspect the nearest existing implementation and test that establish the local structure and
   naming. If none exists, say so.
3. Before editing, say which instruction files and reference implementations you used.
4. Before finishing, re-read the applicable instructions and perform a standards-only review of
   the diff. Fix deviations that lint and tests cannot detect before reporting completion.

## Commands

While working, scope tools to what you changed (e.g. `pnpm --filter @janggi/webapp exec vitest run
src/redux`). Before finishing:

```bash
pnpm checks              # lint + format check + type check + unit tests, every package
pnpm format              # apply Prettier; fixes most format:check failures
pnpm lint:fix            # apply the ESLint fixes that are automatic
pnpm start               # dev server on http://localhost:3000
pnpm acceptance-tests    # needs `pnpm start` running in another terminal
pnpm acceptance-tests:pwa # release updates; needs the compiled webapp running under its preview script
pnpm install-browsers    # one-time Playwright chromium download
pnpm test:properties     # the property tests, which `pnpm checks` leaves out
pnpm test:bot-games      # whole games on the real engine under Node, also left out
pnpm acceptance-tests:bot-games  # a whole game in the browser, left out of `pnpm acceptance-tests`
```

`pnpm checks` is the gate (`--max-warnings=0`). It deliberately leaves out the property tests — a
fresh seed every run means a failure isn't reproducible from the same commit, so it can't gate a
deploy — and the bot games, which play whole games against the real Fairy-Stockfish and are slow and
non-deterministic. Run `pnpm test:properties` before finishing work in `webapp/src/game/`, and
`pnpm test:bot-games` / `pnpm acceptance-tests:bot-games` before finishing work in `webapp/src/bot/`.

## How work is done here

This project is Acceptance Test Driven. **Write the acceptance test first**, watch it fail for the
right reason, then make it pass. See `acceptance-tests/AGENTS.md`.

**A passing test proves nothing until you have watched it fail.** For a test written after the code,
or cover you inherited, the way to prove it is **mutation**: break what the test claims to cover, run
it, confirm it fails, and fails for the right reason. This has repeatedly caught tests that asserted
nothing. Two things worth knowing while doing it: **`grep` the file after mutating** (Prettier has
twice silently reflowed a multi-line mutation away, giving a false-green run), and **note which tests
fell** (the wrong ones, or too many, means the cover is in the wrong place).

**Do not wrap a unit test file in a top-level `describe`.** The filename already names the single
export it covers; write `it(...)` at the top level. Reach for `describe` only where it earns its
keep — ask **does the `describe` name say something the `it` names would otherwise each have to
say?** Yes for a subject with states (`beforeEach` narrowing per step) or genuinely different setups;
no for a plain function (a flat list of `it(...)`) or as a filing cabinet with nothing in `beforeEach`.

This governs unit tests only — acceptance specs are the opposite case, their `given`/`when` nesting
**is** the specification. See `acceptance-tests/AGENTS.md`.

## Code style

Prettier owns formatting (`pnpm format`). What it won't tell you:

- **Declare functions below their callers**, so a file reads top to bottom. Helpers must be
  `function` declarations — an arrow `const` is in the temporal dead zone above its line.
- **Extract pure logic and hooks when they're easy to test alone.** A small function local to a TSX
  component — an event handler closing over its props/hooks/dispatch — may stay inline when that
  keeps the JSX readable.
- **A filename is PascalCase and names its single export**, including hooks (`UseMoveSelection.ts`
  exports `useMoveSelection`). A test takes the name of its subject and sits beside it.
- **A file lives as close to its caller as it can, in a subdirectory of it.** A helper used by one
  file goes in a folder beneath it, never beside it; something shared rises to its callers' nearest
  common ancestor and no further.
- **A folder's root is its table of contents.** The handful of entry points that say what's in there
  stay at the top; everything else drops into a subfolder named for its subject. Around six files is
  where a folder starts reading as a bucket rather than a list — a smell, not a hard limit.
- **Name a folder for its subject, not its shape.** `bikjang/`, `record/`, `status/` say what's
  inside; `buttons/`, `helpers/`, `styles/` describe the files' form and leave a reader no wiser.
  `utils/` is a shape name too — the last resort, not the default home for a plain function.
- **A union of literals is read off the list, not written twice.** Declare it `as const` and derive
  the type from it (`(typeof X)[number]`), so the two can't drift apart. A union with no runtime list
  to keep it honest stays a plain `type`.
- **Give every type a name.** No inline object type or union in a signature, a field, or a `Record`'s
  value. Exception: a component's own `Props`.
- **Three parameters at most; past that, take one object.** What a function acts *through* (an
  engine, an audio context) may stay positional ahead of the object.
- **Name a variable after the type it holds**, where the type has a name of its own.
- **A body on a line of its own is braced** (`curly: multi-line`, ESLint-enforced; Prettier won't add
  or remove braces).
- **No `../` imports** — use the `@src/*` alias each package maps to its own `src/`.
- **Explicit return types** on function declarations; `import type` for type-only imports
  (`verbatimModuleSyntax` is on).
- Prefer a named `export function` over `export default`.

`webapp/src/react/AGENTS.md` has the two rules this doesn't cover — components are the one place
"declare below callers" doesn't apply, and JSX has its own layout conventions.

## Import boundaries

Enforced by ESLint (`no-restricted-imports`, in `shared/config/eslint.base.js`) — a violation fails
`pnpm checks`.

| From                | May import                                                    |
| ------------------- | -------------------------------------------------------------- |
| `shared/`           | nothing else in the workspace — it is the bottom of the graph |
| `webapp/`           | itself and `@janggi/shared`                                   |
| `acceptance-tests/` | itself and `@janggi/shared`                                   |

A workspace package added later is **denied by default**; add it to `allowedPackages` in that
package's `eslint.config.js` to permit it. Packages enforce their own internal layering too — see the
`AGENTS.md` in each (webapp's covers `react/` → `redux/` → `game/`, plus `audio/`, `bot/`,
`styles/`).

Flat config replaces a rule rather than merging it, so **never write `"no-restricted-imports"`
directly in an override** — call `restrictedImports({...})` from `shared/config/eslint.base.js`, or
the boundary is silently dropped for those files.

## More than one session may be running

Several agent sessions can be open on this working tree at once, and nothing tells you when another
one starts. The working tree, the index, the stash and the editor's language servers are all shared.

- **Re-read a file immediately before you change it** — a targeted edit beats rewriting a whole file,
  which silently reverts whatever landed in between.
- **Never run a command that moves work you didn't write:** `git stash`, `git checkout`/`restore`,
  `git reset`, `git read-tree`, `git clean`. `stash` is the worst — `pop` brings everything back
  unstaged, flattening a staging split someone was relying on.
- **Never run repo-wide rewrites** (`pnpm format`, `pnpm lint:fix`) — format only the files you touched.
- **Reading is always safe** (`git status`, `git diff`, `pnpm lint`, `pnpm test`), but `git status`
  shows everyone's work — don't report it as a description of yours.

`pgrep -a claude` shows what else is live — each session is one line carrying
`--permission-prompt-tool`. More than one and you're not alone: ask first, naming the command and why.

## Working on a feature in a worktree

Anything bigger than a small fix goes in its own git worktree, so the main checkout stays free for
others. `EnterWorktree` makes one under `.claude/worktrees/<name>` on branch `worktree-<name>`
(`git worktree add` does the same by hand).

1. **Install its own dependencies** — a worktree has no `node_modules`:
   `pnpm install --frozen-lockfile --offline`.
2. **The files are yours; the repository isn't.** Branches, remotes and the stash are shared with
   every other checkout, so the concurrency rules above still hold — above all, never `git stash` in
   a worktree. Set work aside with a WIP commit on your own branch instead.
3. **Run the app on a port of your own** and point specs at it (`vite --port 3100 --strictPort`, then
   `WEBAPP_URL=http://localhost:3100` for Playwright), or you'll test somebody else's code.
4. **Verify before handing over**: `pnpm checks`, the acceptance suite against your own port, and
   `pnpm test:bot-games` when the bot is involved.
5. **Stop, and leave the work uncommitted.** Say what changed and what you ran — the branch is
   reviewed and committed by hand.
6. **Merge from the main checkout only, once that commit exists**
   (`git -C /path/to/main-checkout merge worktree-<name>`) — expect a real merge, not a
   fast-forward. **A clean text merge proves nothing**: re-run `pnpm checks` (and the acceptance suite
   where both sides touched the same area), then tear down: `git worktree remove
   .claude/worktrees/<name>` and `git branch -d worktree-<name>` (`ExitWorktree` is a no-op against a
   worktree from an earlier session).
7. **Kill any dev server you started by process, not wrapper** — `pkill -f "vite --port <port>"`, or
   the next `--strictPort` start fails with "Port is already in use".

Pushing is the human's, always.

## Keeping the context small

Every tool result is re-read on each later API call in the session, so a large one is paid for again
and again, not once.

- **Read the part of a file you need, not the file** — `grep -n` to find it, `sed -n` to read it.
  Never `cat` a source file, and never sweep a directory with a `for f in …; do cat "$f"; done` loop.
- **This file and the current package's `AGENTS.md` are already in your context** — both are loaded
  before your first turn. Don't `cat` either.
- **Keep these files worth what they cost.** Every session pays for the ones in its chain in full —
  when you add to an `AGENTS.md`, take out whatever it supersedes.
- **A batched check is the cheap shape.** `pnpm checks` is quiet when it passes — never skip a check
  to save context; skipping is what costs.

## Ask before

- **Adding or upgrading any dependency.** Versions are exact-pinned, several deliberately (see
  Gotchas), and a `minimumReleaseAge` supply-chain policy rejects packages published in the last day.
- **Deleting or rebuilding `pnpm-lock.yaml`.** It re-resolves every transitive dependency.
- **Any git commit, branch or push.** The one standing exception: the worktree-merge flow above,
  agreed in advance. Pushing never is.
- **Any git command that writes to the index, the stash or the working tree.**

## Gotchas that will waste your time

- **Do not upgrade TypeScript past 6.0.3.** TS 7's native compiler ships without a stable
  programmatic API, so `typescript-eslint` cannot read the AST and ESLint crashes on startup. Revisit
  at TS 7.1.
- **Do not add `baseUrl` to a tsconfig.** TS 6 made it an error — `paths` already resolve relative to
  the tsconfig's own directory.
- **`pnpm setup` is a built-in pnpm command**, not ours. The script is `pnpm install-browsers`.
- **The remote is called `github`, not `origin`.** `git branch -vv` says how far ahead you are.
- **Root-level files get no Prettier config from a package directory** — `AGENTS.md` and `docs/`
  fall back to 80 columns and rewrap content you never touched. Edit them by hand.
- On Linux/WSL, Chromium needs system libraries once:
  `pnpm --filter @janggi/acceptance-tests exec playwright install-deps chromium` (needs sudo), or
  every acceptance test fails on browser launch with `libnspr4.so`.

## CI and deployment

`ci.yml` runs `checks`, then `acceptance-tests` against a production build (`vite preview`), then
deploys `main` to GitHub Pages, gated on both. `property-tests.yml` and `bot-games.yml` run on every
push/PR and on demand, and go **red on failure but gate nothing** — a fresh seed / a non-deterministic
real engine means a failure isn't reproducible from the same commit. **If branch protection is ever
turned on, leave both out of required checks**, or they become a gate by the back door.

`renovate.json` is committed but **inert until the Renovate GitHub App is installed**. Pages serves
under the repo name, so `BASE_PATH=/<repo>/` feeds both Vite's `base` and the PWA manifest's
`start_url`/`scope` — the DSL navigates with `goto("./")`, not `"/"`, for the same reason.

## Tool configuration

Base config lives in `shared/config/` — change a rule there, not in a package. A package's
`eslint.config.js` must call `baseConfig({tsconfigRootDir: import.meta.dirname, ...})` or it throws:
the editor runs one ESLint server for the whole workspace, and without an explicit root the parser
mixes up which package a file belongs to.
