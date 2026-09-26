# AGENTS.md — tests

```ts
import {expect, given, then, when} from "@acceptance-criteria-mapping";

given("a user opens the game for the first time", () => {
  when("the page has loaded", () => {
    then("the board is visible", async ({janggi}) => {
      const visible = await janggi.board.isVisible();

      expect(visible).toBe(true);
    });
  });
});
```

`given`/`when` are `test.describe`; `then` is `test`, which is why only `then` receives the DSL.

## Arrange in a `beforeEach`, assert in the `then`

**A `then` states one criterion and checks it. It does not set anything up.** Whatever a `given` or a
`when` says has happened is made to happen in a `beforeEach` on that block, so the criterion is the
only thing in the test body:

```ts
when("cho selects one of its soldiers", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
  });

  then("the point it stands on is shown as selected", async ({janggi}) => {
    expect(await janggi.board.isSelected(1, 7)).toBe(true);
  });
```

Otherwise every sibling criterion repeats the same three lines and the one line the spec is about is
buried in them. `beforeEach` is exported from `AcceptanceCriteriaMapping` and receives the DSL and
nothing else, exactly as a criterion does.

**A lint rule enforces it** (`no-restricted-syntax`, in this package's `eslint.config.js`): calling a
DSL _action_ inside a `then` fails `pnpm checks`. It works because the DSL splits by name (see the
DSL `AGENTS.md`'s naming table) — an action is a verb, a query or question is not. **That list cannot
be derived, so adding an action to the DSL means adding it to the rule too.**

**The root `AGENTS.md`'s ban on a wrapper `describe` does not apply here.** There it stops a unit test
file restating its own filename; here the `given`/`when` nesting **is** the acceptance criterion, and
it's expected on every spec — write the full three levels even when a `given` holds one `when`. The
ban does still apply to the Vitest tests for DSL helpers, which are unit tests like any other.

## `given.each` / `when.each`

Where a criterion holds for every member of a set, `each` writes one suite per item:

```ts
when.each(
  EVERY_PIECE_SET,
  set => `the set in use is ${set}`,
  set => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo(set);
    });

    then("it is the writing that changed and never the game", async ({janggi}) => { ... });
  },
);
```

**Playwright has no `test.each` or `describe.each`** — its answer to a parameterised test is a `for`
loop around `test()`, and `each` is that loop with the naming kept. One suite per item beats one
criterion looping inside itself: each gets its own page, a failure names the item that failed, and the
arrangement goes in a `beforeEach` instead of tripping the rule above.

Reading the list off the shared union — `PIECE_SET_NAMES` here — means a member added to the app is
covered without anyone remembering to come back, and a member _removed_ is still caught, because the
`when`s naming each one individually stop compiling.

One thing bites: **a list declared in the spec rather than imported must sit above the `given`**, not
below it as a helper would — `each` runs when the file is collected, so a `const` underneath is still
in the temporal dead zone.

If the setup differs between criteria, that's a second `when`, not a shared one — see
`ChoosingABoard.test.ts`, where "the board is changed" and "the board is changed after a piece set was
chosen" are separate because the order is what one of them is about. The single exemption in the
suite is the loop in `ChoosingAPieceSet.test.ts`, where choosing every set in turn **is** the
criterion; it carries a scoped `eslint-disable` saying so.

## Fixtures and spec organisation

**A second device is the one other fixture.** `anotherDevice` is the app open in a second browser
context, for a spec that plays a game between two copies of it: `PlayingTheBotToTheEnd.test.ts` has
the strongest bot choose the player's moves on one, and relays every turn to the other by hand. Only
`beforeEach.withAnotherDevice` names it — named in `withDslOnly`, it would open a second context for
every spec in the suite. A test that opens one is given ten minutes, since a game played out is
minutes of bots thinking, and a spec's own helper is handed a device typed as `Janggi`, from the
mapping. That spec is left out of `pnpm acceptance-tests`: the default projects ignore
`BOT_GAME_SPECS`, and `playwright.bot-games.config.ts` (`pnpm acceptance-tests:bot-games`) runs it
alone, in `.github/workflows/bot-games.yml`, which gates no deploy.

**The release-update specs are separate for the opposite reason:** they're deterministic and gate the
deploy, but need the production service worker that the Vite development server deliberately omits.
The default projects ignore `PWA_SPECS`; `playwright.pwa.config.ts` (`pnpm acceptance-tests:pwa`) runs
them against a compiled build in CI and against GitHub Pages after deployment.

## Returning players, and the onboarding specs

**Every spec starts as a returning player.** A first visit is greeted by a welcome that stands over the
board and the settings button, so the fixture keeps the app's own "done" onboarding record
(`ONBOARDING_DONE_JSON` under `ONBOARDING_STORAGE_KEY`, both from `@janggi/shared`) before the page loads —
only where nothing is kept yet, so a reload never puts the welcome back over a player who had skipped it, and
with no branch in the app for it. The specs under `src/tests/onboarding/` call `useFreshPlayer()` at the top
of their `given` and are then handed the app as a first visit finds it: no Human opponent, no effects
setting, no progress door. Say what you need in a `beforeEach` — and note the tour's card and ring sit over
the page, so a spec that goes on to use Settings skips the tour first (`ChoosingFromTheWelcome.test.ts`).
The default path costing every other spec nothing is the point: if the key or its version ever changes
without `@janggi/shared` following, the welcome shows and every spec fails on its first tap.

## Motion reduced, and the effects specs

**Every ordinary spec runs with the effects turned down.** The app starts with them in full, so the
`desktop` and `mobile` projects set the `effects` option to `"Reduced"`, and the `janggi` fixture
chooses that in the settings sheet before the spec begins. Those projects also run with
`reducedMotion: "reduce"`, which stills the sheet and the plaques. Nothing flies, shakes, pops or
slides, and no spec ever waits on, or races, an animation.

**Every spec also starts with everything unlocked.** A fresh device has only the first few styles and
the weakest bot, and earning the rest is far deeper than a spec can tap, so the fixture puts the
player at a million XP with every bot beaten, through the app's debug door —
`janggi.debug.setProgress(...)`, which posts a message the app answers (`webapp/src/redux/AGENTS.md`
has why the door is allowed to exist at all). A spec about the locks puts them back wherever it is
about first; those are in `src/tests/progress/`. The save box that sets progress by hand keeps its own
criteria in `progress/MovingYourProgress.test.ts` — keys built by `saveKeyWith`, over the app's own
codec and save schema from `@janggi/shared`, since a key format is a wire contract the specs share
rather than a second copy that could drift.

**Ordinary specs start against a person at the same device.** The app ships against the bot, which
would answer moves and owns one army's setup picker; leaving that implicit would make every unrelated
board criterion race an opponent it never named. The fixture therefore chooses Human through Settings.
A spec about the shipped opponent calls `useShippedOpponent()` at the top of its file and is then
responsible for the bot it kept — `DefaultState.test.ts` is the example.

**The specs about the motion itself live under `src/tests/effects/`** and are run only by the
`desktop-effects` and `mobile-effects` projects, which leave motion on. The default projects
`testIgnore` that folder, so the two sets never mix. Keep an effects spec to what is observable
without a race:

- **Where motion leaves the board**, first — a piece fully shown once its flight lands, nothing left
  drawn over the board, a shaken board back at rest, a rolled score come to rest on the true value.
  Those are what a broken animation gets wrong, and they are deterministic.
- **That motion happened at all**, where it must be checked, by waiting for an element that lasts far
  longer than a tap takes to return — a flight, a capture landing, the board being pushed.
- **Never by sampling mid-animation.** The motion queries poll (`eventually`), wait for an element
  (`appears`), or wait for every finite animation on the page to finish (`motionSettled`) before they
  answer. A query added for motion should do one of the three.

```bash
pnpm acceptance-tests --project=desktop-effects --project=mobile-effects
```
