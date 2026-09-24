# AGENTS.md — webapp

Vite + React 19 + Redux Toolkit + Tailwind v4, client-side rendered, installable as a PWA.

`src/game/`, `src/audio/`, `src/bot/`, `src/react/` and `src/redux/` each have their own `AGENTS.md`
— read the one for what you're touching, in addition to this one, before you touch it. `src/styles/`
(the shape of a board/piece style, the ranges its numbers may take, and what a style that says nothing
of a part gets), `src/sw/` (the service worker) and `src/isolation/` (whether a reload into
cross-origin isolation may still come — asked by `main.tsx`, which does the reload, and by the bot's
engine, which waits for it) don't have one yet; nothing folder-specific has accumulated there.

## Import boundaries

This package's own internal layering, enforced by ESLint alongside the workspace-level table in the
root `AGENTS.md` — a violation of any of these is a lint error:

- Layering is one-way: `react/` → `redux/` → `game/`. `src/redux/` may not import `src/react/` —
  components depend on state, never the reverse.
- `src/game/` may import neither `react/` nor `redux/`, nor React or Redux themselves.
- `audio/` sits beside `redux/`: `react/` may reach it, and it reaches nothing of this package's
  (`src/game/` included), nor React, Redux or `@janggi/shared` — the page decides what a game sounds
  like and hands it cues and a mood to play.
- `src/bot/` may import `src/game/` and `@janggi/shared` only — never the store, the page or the
  sound, nor React or Redux.
- `src/styles/` may import neither the page, the store nor the sound.
- `board/`'s geometry (positions, dimensions, palaces) lives in `src/game/board/`, not in `react/`,
  because the engine needs it too and may not reach into `react/` — `cellShapeAt` in `react/` asks
  `palaceDiagonalStepsAt` for the palace X rather than working it out again, so what's painted and
  what's legal can't drift apart.

Import with the `@src/*` alias. This package may import `@janggi/shared` and nothing else from the
workspace.

Lint rules come from `@eslint-react/eslint-plugin` (React 19 aware, TypeScript-first) plus
`eslint-plugin-react-hooks`. The legacy `eslint-plugin-react` is deliberately not used — do not
reintroduce it.

## Conventions

- `BASE_PATH` sets where the app is served from (`/` locally and on the custom domain) and drives
  the PWA manifest's `start_url`/`scope`. Do not hardcode absolute asset paths.
- Tailwind v4 has no config file — use utilities in JSX. Colour tokens live in the `@theme` block in
  `index.css` (`bg-ground`, `text-cho`, `border-danger`, …), never hex in JSX; motion keyframes live
  there too, and genuinely global rules go in its `@layer base` block. A class list that changes with
  state is built with `clsx` — fixed classes as one string, each conditional as `flag && "class"` —
  never a template string. **Never a ternary inside `clsx`, even for a two-way choice** — a ternary
  forces a reader to hold both branches to find the one that applies; pair `flag && "class-a"` with
  `!flag && "class-b"` instead, so each line reads condition-then-value on its own.

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
