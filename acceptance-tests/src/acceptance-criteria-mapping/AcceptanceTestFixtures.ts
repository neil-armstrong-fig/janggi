import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {Page} from "@playwright/test";
import {test as base} from "@playwright/test";
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
 * `effects` is the one. The app starts with its effects in full, and the ordinary projects turn them
 * down before a spec begins — through the settings sheet, the way a player would — so nothing flies,
 * shakes or pops and no spec ever waits on it. The effects projects leave them as the app starts.
 */
export interface AcceptanceTestOptions {
  effects: EffectsName;
}

export const test = base.extend<AcceptanceTestFixtures & AnotherDeviceFixtures & AcceptanceTestOptions>({
  effects: ["Full", {option: true}],

  janggi: async ({page, effects}, use) => {
    await use(await openedOn(page, effects));
  },

  anotherDevice: async (
    {browser, baseURL, viewport, isMobile, hasTouch, userAgent, deviceScaleFactor, reducedMotion, effects},
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

    await use(await openedOn(await context.newPage(), effects));

    await context.close();
  },
});

export {expect} from "@playwright/test";

/** The app opened on `page`, with its effects turned to what the project asks for. */
async function openedOn(page: Page, effects: EffectsName): Promise<JanggiDsl> {
  const janggi = new JanggiDsl(page);
  await janggi.navigateToPage();

  if (effects !== "Full") await janggi.settings.effects.setTo(effects);

  return janggi;
}

/**
 * How long a test with a second device may run. A game played out is some fifty turns, each waiting on
 * a bot, and the strongest thinks for seconds over each of its own.
 */
const A_GAME_PLAYED_OUT_MS = 600_000;
