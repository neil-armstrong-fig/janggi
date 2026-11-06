# AGENTS.md — webapp

Vite + React 19 + Redux Toolkit + Tailwind v4, client-side rendered, installable as a PWA.

`src/record/`, `src/audio/`, `src/bot/`, `src/react/` and `src/redux/` each have their own `AGENTS.md`
— read the one for what you're touching, in addition to this one, before you touch it. `src/styles/`
(the shape of a board/piece style, the ranges its numbers may take, and what a style that says nothing
of a part gets), `src/sw/` (the service worker) and `src/isolation/` (whether a reload into
cross-origin isolation may still come — asked by `main.tsx`, which does the reload, and by the bot's
engine, which waits for it) don't have one yet; nothing folder-specific has accumulated there.

## Import boundaries

This package's own internal layering, enforced by ESLint alongside the workspace-level table in the
root `AGENTS.md` — a violation of any of these is a lint error:

- Layering is one-way: `react/` → `redux/` → `record/` → the engine (`@janggi/engine`, its own package). `src/redux/` may not import `src/react/` —
  components depend on state, never the reverse.
- The engine is the `engine/` package (`engine/AGENTS.md`): it imports neither this package, React nor Redux, and only this
  package and `api` may import it.
- `audio/` sits beside `redux/`: `react/` may reach it, and it reaches nothing of this package's
  (the engine included), nor React, Redux or `@janggi/shared` — the page decides what a game sounds
  like and hands it cues and a mood to play.
- `src/bot/` may import `@janggi/engine` and `@janggi/shared` only — never the store, the page or the
  sound, nor React or Redux.
- `src/styles/` may import neither the page, the store nor the sound.
- `src/language/` is every word of the game a player reads, one `Messages` per language, in a folder per area, then one per translated type with an `english/` and `korean/` folder beneath it (`docs/localisation.md`), looked up by
  `messagesOf`. It may import `@janggi/shared` and nothing else, so the page and the store can both reach it. Components get
  the words through `useMessages` (`react/pages/game/hooks/`) rather than writing them; an id in the code (a tab, a side, a
  way of drawing) stays English, and what a player reads for it is looked up here. A sentence is a function, so each
  language orders it for itself. `docs/localisation.md` has the decisions and the backlog (and `docs/seo.md` what a search
  engine sees). Moved over so far: the tabs, controls, turn line, result banner and its explanations, the Play, Look and Sound tabs, plaques,
  draw offer and bot notices, the repetition note, the record sheet, welcome and tour, and the You tab with the toast and the
  rename answers (`you`, `toasts`; Redux reaches them through `messagesOf` and the language in the store), playing a friend,
  piece names for screen readers, the clock, the match-format explanation, unlock names, the guided tutorial (`tutorial`), and the styles sheet and editor (`styles`). Still English: the
  legal pages, a style checker's notes on a field of its JSON (`Reading`), and style names, which stay as proper names in every language. The Korean is shown with a note (`LanguageNotice`) that it is a work in progress; take that
  out when it is not. The guide has `GuideMessages` of its own (`guideMessagesOf`), handed to `LearnPage` as props rather than carried by every
  game page, and its Korean is a machine translation that opens with a notice (`translationNotice`); take that out once a native speaker has read it. The references have `ReferencesMessages` (`referencesMessagesOf`) on the same terms.
- `board/`'s geometry (positions, dimensions, palaces) lives in `engine/src/board/`, not in `react/`,
  because the engine needs it too and may not reach into `react/` — `cellShapeAt` in `react/` asks
  `palaceDiagonalStepsAt` for the palace X rather than working it out again, so what's painted and
  what's legal can't drift apart.

Import with the `@src/*` alias. This package may import `@janggi/shared` and nothing else from the
workspace.

Lint rules come from `@eslint-react/eslint-plugin` (React 19 aware, TypeScript-first) plus
`eslint-plugin-react-hooks`. The legacy `eslint-plugin-react` is deliberately not used — do not
reintroduce it.

## Conventions

- **Work not yet in production goes behind `IN_DEVELOPMENT`** (`src/unreleased/InDevelopment.ts`): `{IN_DEVELOPMENT && <Thing />}`.
  It is on under `pnpm start`, and anywhere else only with `?IN_DEVELOPMENT=true` in the address; `?IN_DEVELOPMENT=false`
  turns it off under `pnpm start`. It is one switch for all such work, read once as the page opens and not kept. **The code ships in
  every build, so this hides work and does not protect it**: anyone can turn it on, and nothing secret or harmful to a
  player's saved data belongs behind it. Wear test ids beginning `unreleased-` so a reader can see what is gated.
  Its words stay inline in English until release, and its specs go in `acceptance-tests/src/tests/unreleased/`. To
  release a feature: remove its gate, move its words to `Messages` with their Korean, rename its test ids, and move its
  specs out of `unreleased/`. This only gates the site: the API deploys from `main` by itself, so a real endpoint for
  unreleased work needs a gate of its own.
- `BASE_PATH` sets where the app is served from (`/` locally and on the custom domain) and drives
  the PWA manifest's `start_url`/`scope`. Do not hardcode absolute asset paths.
- Tailwind v4 has no config file — use utilities in JSX. Colour tokens live in the `@theme` block in
  `index.css` (`bg-ground`, `text-cho`, `border-danger`, …), never hex in JSX; motion keyframes live
  there too, and genuinely global rules go in its `@layer base` block. A class list that changes with
  state is built with `clsx` — fixed classes as one string, each conditional as `flag && "class"` —
  never a template string. **Never a ternary inside `clsx`, even for a two-way choice** — a ternary
  forces a reader to hold both branches to find the one that applies; pair `flag && "class-a"` with
  `!flag && "class-b"` instead, so each line reads condition-then-value on its own.

## The build

`vite.config.ts` is the configuration and the list of plugins, and nothing else. What each plugin does lives
under `vite/`, one folder per subject: `engine/` (Fairy-Stockfish's files, and the isolation headers it needs),
`prerendered-pages/`, `sitemap/` (dated from git), `installable-app/` (the manifest) and `build-id/`. It is build
code, not app code: it cannot use `@src/*` (Vite reads the config before the alias exists), so it imports its
neighbours with `./x.js`. Its tests sit beside it and run with the rest.

## Testing

**Do not write React Testing Library tests for components or pages.** That's covered by the
Playwright acceptance specs in `acceptance-tests/`, which drive the real app — that's what the ATDD
workflow in the root `AGENTS.md` is for. RTL **is** used for hooks, via `renderHook` — a hook has
inputs, state transitions and a return value that aren't reachable from an acceptance test except
through a page.

**Where a state can't be _reached_ by tapping, unit test the pure function underneath it**, and let
the acceptance spec cover only what a player can actually do — a test-only door into the app is
shipped code no player can reach, and every spec then leans on it instead of on the app. A checkmate
is far deeper than anyone can tap out, so `WinningAGame.test.ts` drives a real check through the UI
and stops there, while `GameStatusOf.test.ts` beside the component covers the win. (The one deliberate
exception — a door onto progress, never onto the game itself — is in `redux/AGENTS.md`.)

| Code                                 | Tested by                                |
| ------------------------------------ | ---------------------------------------- |
| Components and pages (`src/react/`)  | acceptance tests, not unit tests         |
| Custom hooks                         | Vitest + `renderHook`                    |
| Reducers, selectors, plain functions | Vitest, called directly — no RTL, no DOM |
| Playback's decisions (`src/audio/`)  | Vitest; its node graph is checked by ear |

**Tests run on `node`, not `jsdom`** — building a DOM was 75% of the suite's runtime, and nothing
here needed one. A hook test that does need a DOM opts in with two lines of its own:

```ts
// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
```

Both are needed — forget the import and the matchers are simply missing. `renderHook` works exactly
as before.

Bot and redux each have a testing note of their own — see `bot/AGENTS.md` (the one test that plays
the real engine) and `redux/AGENTS.md` (the debug door).

## The icon

The SVG favicon and all PNG home-screen icons in `public/` are **generated** — do not hand-edit them.
`scripts/generate-icon.mjs` draws 장기 out of line segments and one circle, so the icon carries no
font and no traced artwork. Change the strokes there and re-run:

```bash
pnpm --filter @janggi/webapp generate-icon
```

## Commands

```bash
pnpm --filter @janggi/webapp start      # or `pnpm start` from the root
VITE_DEBUG_XP=640 pnpm start            # open at 640 XP, over whatever is stored
VITE_DEBUG_XP='{"xp":30,"beaten":{"cho":[800]}}' pnpm start   # with bots beaten as well
pnpm --filter @janggi/webapp test       # Vitest — hook and plain-logic tests
pnpm --filter @janggi/webapp test:bot-games   # whole games on the real engine, left out of `test`
pnpm --filter @janggi/webapp compile    # tsc --noEmit && vite build, output in build/
```
