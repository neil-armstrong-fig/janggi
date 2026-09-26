import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {Page} from "@playwright/test";
import {test as base} from "@playwright/test";
import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import {ONBOARDING_DONE_JSON, ONBOARDING_STORAGE_KEY} from "@janggi/shared/janggi/onboarding/OnboardingStorage";
import {JanggiDsl} from "@src/dsl/janggi/JanggiDsl";

/**
 * The DSL objects a spec can ask for. Each one arrives ready to use — navigated, and wrapped so the
 * spec never touches a Playwright locator.
 *
 * There is one for the app, deliberately: `janggi` is the whole application, and every area of it is
 * reached through a member of that rather than through a fixture of its own. A second fixture here
 * would mean a second thing to navigate and keep in step; a second member on `JanggiDsl` costs nothing.
 * The one exception is a second *device* — `AnotherDeviceFixtures`, below — which is not an area of
 * the app but another copy of it.
 *
 * Handing the browser to the DSL happens here: `JanggiDsl` takes the page, builds its own
 * `*Playwright` counterpart with it and passes the same page down to each area, which does the same.
 * A `*Dsl` may name a `Page` for that and for nothing else — it never stores one, so `this.page`
 * cannot be reached from a method, and a lint rule says so as well.
 */
export interface AcceptanceTestFixtures {
  janggi: JanggiDsl;
}

/**
 * The app open on a second device, for a spec that plays a game between two copies of it —
 * `PlayingTheBotToTheEnd.test.ts`, where the player's moves are chosen by a bot on the other one.
 *
 * Kept apart from `AcceptanceTestFixtures` because Playwright builds a fixture for a test only where
 * something names it, and only `beforeEach.withAnotherDevice` names this one — so no other spec pays
 * for a second browser context. It is opened as the test's own page is: the same address, the same
 * window and the same effects.
 */
export interface AnotherDeviceFixtures {
  anotherDevice: JanggiDsl;
}

/**
 * What a project may say about how every spec in it starts, set in `playwright.config.ts`.
 *
 * The app starts with its effects in full, and the ordinary projects turn them down before a spec
 * begins — through the settings sheet, the way a player would — so nothing flies, shakes or pops and no
 * spec ever waits on it. The effects projects leave them as the app starts.
 *
 * The shipped opponent is the bot, which would answer moves and owns its own setup picker. Ordinary
 * specs explicitly start against a person at the same device so unrelated criteria remain in control of
 * both armies. The one spec about the shipped opponent keeps it through `keepShippedOpponent`.
 *
 * Every spec also starts as a returning player, who is not welcomed or shown around. The specs about
 * the welcome and the tour ask for a first visit through `freshPlayer`, and are then responsible for
 * everything they would otherwise have been handed: the opponent, the effects and the progress.
 */
export interface AcceptanceTestOptions {
  effects: EffectsName;
  keepShippedOpponent: boolean;
  freshPlayer: boolean;
}

export const test = base.extend<AcceptanceTestFixtures & AnotherDeviceFixtures & AcceptanceTestOptions>({
  effects: ["Full", {option: true}],
  keepShippedOpponent: [false, {option: true}],
  freshPlayer: [false, {option: true}],

  janggi: async ({page, effects, keepShippedOpponent, freshPlayer}, use) => {
    await use(await openedOn(page, {effects, keepShippedOpponent, freshPlayer}));
  },

  anotherDevice: async (
    {
      browser,
      baseURL,
      viewport,
      isMobile,
      hasTouch,
      userAgent,
      deviceScaleFactor,
      reducedMotion,
      effects,
      keepShippedOpponent,
      freshPlayer,
    },
    use,
    testInfo,
  ) => {
    // The one reason to bring in a second device is to play a game out, which is minutes of bots
    // thinking where the config's timeout suits a spec of a few taps.
    testInfo.setTimeout(A_GAME_PLAYED_OUT_MS);

    const context = await browser.newContext({
      baseURL,
      viewport,
      isMobile,
      hasTouch,
      userAgent,
      deviceScaleFactor,
      reducedMotion,
    });

    await use(await openedOn(await context.newPage(), {effects, keepShippedOpponent, freshPlayer}));

    await context.close();
  },
});

export {expect} from "@playwright/test";

/**
 * The app opened on `page`, with its effects turned to what the project asks for, and **everything
 * unlocked**.
 *
 * A fresh device has only the first board, the first few piece sets and the weakest bot, and earning the
 * rest is far deeper than a spec can tap. So every spec starts with a million XP and every bot beaten,
 * set through the app's debug door (`janggi.debug`) — and a spec about the locks themselves puts the
 * player back wherever it is about first. `src/tests/progress/` is where those are.
 *
 * A spec that asks for a `freshPlayer` is handed the app as a first visit finds it and nothing more: the
 * welcome is in the way of Settings, so the arrangement above is left to the spec.
 */
async function openedOn(page: Page, options: OpeningOptions): Promise<JanggiDsl> {
  const {effects, keepShippedOpponent, freshPlayer} = options;

  if (!freshPlayer) await page.context().addInitScript(keepOnboardingDone, ONBOARDING_KEPT);

  const janggi = new JanggiDsl(page);
  await janggi.navigateToPage();
  if (freshPlayer) return janggi;

  if (!keepShippedOpponent) await janggi.settings.opponent.setTo("Human");
  if (effects !== "Full") await janggi.settings.effects.setTo(effects);
  await janggi.debug.setProgress(EVERYTHING_UNLOCKED);

  return janggi;
}

type OpeningOptions = Pick<AcceptanceTestOptions, "effects" | "keepShippedOpponent" | "freshPlayer">;

interface OnboardingKept {
  key: string;
  json: string;
}

/**
 * What the page is told before its own scripts run, so a returning player has been shown around by the
 * time the app reads its storage. Only where nothing is kept yet: a reload keeps whatever the app has
 * since written, and never sets the welcome back over a player who had skipped it.
 */
const ONBOARDING_KEPT: OnboardingKept = {key: ONBOARDING_STORAGE_KEY, json: ONBOARDING_DONE_JSON};

/** Runs in the page, so it can reach nothing of this module. */
function keepOnboardingDone(kept: OnboardingKept): void {
  try {
    if (localStorage.getItem(kept.key) === null) localStorage.setItem(kept.key, kept.json);
  } catch {
    // Storage blocked: the app falls back to a first visit, and the specs fail loudly on the welcome.
  }
}

/** A million XP, and every bot beaten with both armies in both formats. */
const EVERYTHING_UNLOCKED = {
  xp: 1_000_000,
  beaten: {Casual: {cho: BOT_ELOS, han: BOT_ELOS}, Scored: {cho: BOT_ELOS, han: BOT_ELOS}},
};

/**
 * How long a test with a second device may run. A game played out is some fifty turns, each waiting on
 * a bot, and the strongest thinks for seconds over each of its own.
 */
const A_GAME_PLAYED_OUT_MS = 600_000;
