import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import {test as base} from "@playwright/test";
import {JanggiDsl} from "@src/dsl/janggi/JanggiDsl";

/**
 * The DSL objects a spec can ask for. Each one arrives ready to use — navigated, and wrapped so the
 * spec never touches a Playwright locator.
 *
 * There is one for the app, deliberately: `janggi` is the whole application, and every area of it is
 * reached through a member of that rather than through a fixture of its own. A second fixture here
 * would mean a second thing to navigate and keep in step; a second member on `JanggiDsl` costs nothing.
 * A second *device* is not an area of the app but another copy of it, and a spec asks the app for one when it needs
 * one (`janggi.openSeparateDevice()`), so no spec pays for a second browser context it does not use.
 *
 * Handing the browser to the DSL happens here, along with how the project wants every device set up: `JanggiDsl` takes
 * the page, builds its own
 * `*Playwright` counterpart with it and passes the same page down to each area, which does the same.
 * A `*Dsl` may name a `Page` for that and for nothing else — it never stores one, so `this.page`
 * cannot be reached from a method, and a lint rule says so as well.
 */
export interface AcceptanceTestFixtures {
  janggi: JanggiDsl;
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

export const test = base.extend<AcceptanceTestFixtures & AcceptanceTestOptions>({
  effects: ["Full", {option: true}],
  keepShippedOpponent: [false, {option: true}],
  freshPlayer: [false, {option: true}],

  janggi: async (
    {
      page,
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
  ) => {
    const context = {baseURL, viewport, isMobile, hasTouch, userAgent, deviceScaleFactor, reducedMotion};
    const janggi = new JanggiDsl(page, {context, effects, keepShippedOpponent, freshPlayer});

    await janggi.begin();
    await use(janggi);
    await janggi.closeSeparateDevices();
  },
});

export {expect} from "@playwright/test";
