import type {BrowserContextOptions} from "@playwright/test";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";

/**
 * How a device comes to be what a spec starts with, which the project chooses in `playwright.config.ts`: the browser
 * context it is viewed through (window, touch, motion), and how the app is arranged once it is open. A second device a
 * spec opens is made the same way as the first, so the two are the same kind of phone or window.
 *
 * The app starts with its effects in full, and the ordinary projects turn them down before a spec begins — through the
 * settings sheet, the way a player would — so nothing flies, shakes or pops and no spec ever waits on it. The effects
 * projects leave them as the app starts.
 *
 * The shipped opponent is the bot, which would answer moves and owns its own setup picker. Ordinary specs explicitly start
 * against a person at the same device, so unrelated criteria remain in control of both armies; the one spec about the
 * shipped opponent keeps it. A spec that asks for a fresh player is handed the app as a first visit finds it and nothing
 * more: the welcome is in the way of Settings, so the rest is left to the spec.
 */
export interface DeviceSetup {
  readonly context: BrowserContextOptions;
  readonly effects: EffectsName;
  readonly keepShippedOpponent: boolean;
  readonly freshPlayer: boolean;
}
