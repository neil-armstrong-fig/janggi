import type {Locator, BrowserContextOptions, CDPSession, Page} from "@playwright/test";
import {ONBOARDING_DONE_JSON, ONBOARDING_STORAGE_KEY} from "@janggi/shared/janggi/onboarding/OnboardingStorage";
import {BasePage} from "@src/dsl/playwright/BasePage";
import type {InstallationAppearance, InstallationIcon} from "@src/dsl/janggi/types/InstallationAppearance";
import type {OnboardingKept} from "@src/dsl/janggi/playwright/types/OnboardingKept";
import type {InstallationManifest} from "@src/dsl/janggi/types/InstallationManifest";
import {ISOLATION_TIMEOUT_MS} from "@src/dsl/playwright/IsolationTimeout";

/** The script the page loads the bot's engine from, and so the first thing that fails when it cannot. */
const ENGINE_SCRIPT = "**/engine/stockfish.js";

/**
 * The property the page is given once a held-back engine may arrive. It lives on the page, so a reload
 * clears it and the next load is held afresh — the browser is the memory, not the DSL.
 */
const ENGINE_MAY_ARRIVE = "janggiBotEngineMayArrive";

/**
 * The app, and the only screen it has. The bottom of the stack: this is the layer that actually
 * drives Playwright, and the only one that may.
 *
 * It owns the browser — opening the app, and the window it is viewed through — and nothing else.
 * The areas of the screen are not its children: each one's `*Dsl` builds its own counterpart from
 * the same page, so this is the counterpart of `JanggiDsl` and no other object's parent. Nothing
 * here catches anything: a failure comes out as whatever Playwright threw, and `JanggiDsl` above is
 * what turns it into a sentence about the intention.
 */
export class JanggiPlaywright extends BasePage {
  /**
   * Holds the one CDP session that toggles the service worker bypass on and off, against the "no
   * state between calls" rule every other `*Playwright` follows — Chromium keeps that bypass per
   * attaching session rather than per page, so a second session's `false` does not cancel a first
   * session's `true`; only the session that set it can unset it. It exists for exactly that one
   * pairing (`reachTheEngineOnlyThroughTheNetwork` / `restoreTheBotsEngine`) and nothing reads it
   * as a signal of anything the app itself is doing. Safe against the fixture's own reordering
   * concern too: a fresh `JanggiPlaywright` is built for every test, so nothing here can be stale
   * from one test to the next — only from one call to the next within the same test, which this
   * one pairing requires by nature.
   */
  private cdpSession: CDPSession | undefined;
  private readonly documentRoot: Locator;
  private readonly manifestLink: Locator;
  private readonly appleTouchIconLink: Locator;
  private readonly heading: Locator;

  constructor(page: Page) {
    super(page);

    this.documentRoot = this.page.locator("html");
    this.manifestLink = this.page.locator("link[rel='manifest']");
    this.appleTouchIconLink = this.page.locator("link[rel='apple-touch-icon']");
    this.heading = this.page.locator("h1");
  }

  /**
   * What the page is told before its own scripts run, so a returning player has been shown around by the time the app
   * reads its storage. Only where nothing is kept yet: a reload keeps whatever the app has since written, and never sets
   * the welcome back over a player who had skipped it. The key and the record are the app's own, from `@janggi/shared`: if
   * either changes without that package following, the welcome shows and every spec fails on its first tap.
   */
  async keepOnboardingDone(): Promise<void> {
    await this.page.context().addInitScript(
      (kept: OnboardingKept) => {
        try {
          const onboarding = localStorage.getItem(kept.key) ?? undefined;
          if (onboarding === undefined) localStorage.setItem(kept.key, kept.json);
        } catch {
          // Storage blocked: the app falls back to a first visit, and the specs fail loudly on the welcome.
        }
      },
      {key: ONBOARDING_STORAGE_KEY, json: ONBOARDING_DONE_JSON},
    );
  }

  /**
   * A new page in a browser context of its own, as a second device would be: nothing shared with this one but the
   * browser. Made with the options this device was made with, and closed with `closeTheDevice`.
   */
  async openAnotherDevicePage(options: BrowserContextOptions): Promise<Page> {
    const browser = this.page.context().browser() ?? undefined;
    if (browser === undefined) throw new Error("This page has no browser to open another device in");

    return await (await browser.newContext(options)).newPage();
  }

  /** Closes the browser context this page is in, and with it the device. */
  async closeTheDevice(): Promise<void> {
    await this.page.context().close();
  }

  /**
   * Relative to the `baseURL` in `playwright.config.ts`, which the package scripts choose. "./"
   * rather than "/" so a deployment served from a subpath — GitHub Pages — is not skipped past.
   *
   * Opened means cross-origin isolated. GitHub Pages cannot send the headers for that, so on a first
   * visit — which every test's fresh context is — the app's service worker takes control a moment
   * after load and the page reloads under it (`webapp/src/main.tsx`). A spec that started tapping
   * before then would lose its taps to the reload. Locally the server sends the headers and this
   * returns at once.
   */
  async open(): Promise<void> {
    await this.page.goto("./");
    await this.page.waitForFunction(() => globalThis.crossOriginIsolated, undefined, {timeout: ISOLATION_TIMEOUT_MS});
  }

  /** Opens the game with the address saying whether work not yet in production is on, and waits as `open` does. */
  async openWithWorkInDevelopment(on: boolean): Promise<void> {
    await this.page.goto(`./?IN_DEVELOPMENT=${on}`);
    await this.page.waitForFunction(() => globalThis.crossOriginIsolated, undefined, {timeout: ISOLATION_TIMEOUT_MS});
  }

  /** Goes to the game's Korean page, and waits as `open` does. */
  async visitKoreanGame(): Promise<void> {
    await this.page.goto(new URL("ko/", this.page.url()).href);
    await this.page.waitForFunction(() => globalThis.crossOriginIsolated, undefined, {timeout: ISOLATION_TIMEOUT_MS});
  }

  /**
   * From now on the bot's engine does not arrive until `restoreTheBotsEngine`, however long that is —
   * a slow connection, or a phone still starting its threads. Takes effect for the next time the page
   * asks for it, so it is said before the bot is chosen.
   */
  async holdBackTheBotsEngine(): Promise<void> {
    await this.reachTheEngineOnlyThroughTheNetwork();
    await this.page.route(ENGINE_SCRIPT, async route => {
      await this.page.waitForFunction(name => Reflect.get(globalThis, name) === true, ENGINE_MAY_ARRIVE, {
        timeout: 0,
      });
      await route.continue();
    });
  }

  /** From now on the bot's engine cannot be fetched at all, until `restoreTheBotsEngine`. */
  async cutOffTheBotsEngine(): Promise<void> {
    await this.reachTheEngineOnlyThroughTheNetwork();
    await this.page.route(ENGINE_SCRIPT, route => route.abort());
  }

  /**
   * Lets the bot's engine arrive again: whatever was held goes through, and nothing more is held or refused.
   *
   * What lets a held request go is a flag on the page, so no memory of the hold is kept here. The routes
   * are then taken off only once the handlers still running have finished: switching interception off
   * under a request it has paused fails that request. The service worker bypass is switched off too — the
   * engine's own script spawns a worker once it runs, and on `:production` that worker script needs the
   * `Cross-Origin-Embedder-Policy` header only the service worker adds; left bypassed, that fetch would
   * reach a host sending no headers at all and the worker would be blocked from starting.
   */
  async restoreTheBotsEngine(): Promise<void> {
    await this.page.evaluate(name => Reflect.set(globalThis, name, true), ENGINE_MAY_ARRIVE);
    await this.page.unrouteAll({behavior: "wait"});
    await this.setServiceWorkerBypass(false);
  }

  /**
   * Where the app's service worker is running it answers the engine's script out of its precache, and a
   * route on the page never sees the request. Bypassing it sends every request over the network instead —
   * which on `:production` means those requests miss the isolation headers only the service worker adds,
   * so it must come off again before the engine's own worker script is fetched (`restoreTheBotsEngine`).
   */
  private async reachTheEngineOnlyThroughTheNetwork(): Promise<void> {
    await this.setServiceWorkerBypass(true);
  }

  private async setServiceWorkerBypass(bypass: boolean): Promise<void> {
    this.cdpSession ??= await this.page.context().newCDPSession(this.page);
    await this.cdpSession.send("Network.enable");
    await this.cdpSession.send("Network.setBypassServiceWorker", {bypass});
  }

  /** Pausing has to land ahead of the time it starts from, so a second ahead is where time then stands. */
  async takeHoldOfTime(): Promise<void> {
    const now = Date.now();

    await this.page.clock.install({time: now});
    await this.page.clock.pauseAt(now + 1000);
  }

  /** Fires what fell due only once, as a page coming back from the background would, rather than every tick between. */
  async letTimePass(seconds: number): Promise<void> {
    await this.page.clock.fastForward(seconds * 1000);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async reloadOffline(): Promise<void> {
    await this.page.context().setOffline(true);
    await this.page.reload({waitUntil: "domcontentloaded"});
  }

  async offerInstallation(): Promise<void> {
    await this.page.evaluate(() => {
      const event = new Event("beforeinstallprompt", {cancelable: true});
      Object.defineProperties(event, {
        prompt: {
          value: () => {
            document.documentElement.dataset["installPrompted"] = "true";

            return Promise.resolve();
          },
        },
        userChoice: {value: Promise.resolve({outcome: "accepted", platform: "web"})},
      });
      globalThis.dispatchEvent(event);
    });
  }

  async wasInstallationPrompted(): Promise<boolean> {
    return (await this.documentRoot.getAttribute("data-install-prompted")) === "true";
  }

  /** The language the page declares itself to be written in, read off `<html lang>`. */
  async getPageLanguage(): Promise<string> {
    return await this.page.evaluate(() => document.documentElement.lang);
  }

  async getInstallationAppearance(): Promise<InstallationAppearance> {
    const manifestPath = await this.manifestLink.getAttribute("href");
    if (!manifestPath) throw new Error("The page has no web app manifest");

    const manifestAddress = new URL(manifestPath, this.page.url()).href;
    const installationManifest = await this.installationManifestAt(manifestAddress);
    const installationIcons = await Promise.all(
      (installationManifest.icons ?? []).map(async icon => ({
        ...(await this.installationIconAt(new URL(icon.src, manifestAddress).href)),
        purpose: icon.purpose ?? "any",
      })),
    );

    const appleTouchIconPath = await this.appleTouchIconLink.getAttribute("href");
    if (!appleTouchIconPath) throw new Error("The page has no Apple touch icon");

    return {
      name: installationManifest.name ?? "",
      display: installationManifest.display ?? "",
      icons: installationIcons,
      appleTouchIcon: {
        ...(await this.installationIconAt(new URL(appleTouchIconPath, this.page.url()).href)),
        purpose: "any",
      },
    };
  }

  private async installationManifestAt(address: string): Promise<InstallationManifest> {
    return await this.page.evaluate(async address => {
      const response = await fetch(address);
      if (!response.ok) throw new Error(`The web app manifest returned ${response.status}`);

      return (await response.json()) as InstallationManifest;
    }, address);
  }

  private async installationIconAt(address: string): Promise<Omit<InstallationIcon, "purpose">> {
    return await this.page.evaluate(async address => {
      const image = new Image();
      image.src = address;
      await image.decode();

      return {width: image.naturalWidth, height: image.naturalHeight};
    }, address);
  }

  /** Where in the site the page is, as the address bar shows it. */
  async getAddressPath(): Promise<string> {
    return new URL(this.page.url()).pathname;
  }

  async getMainHeading(): Promise<string> {
    return await this.heading.innerText();
  }

  /**
   * Has the browser report a system bar of this height over the bottom of the window, the way Chrome on
   * Android does with its navigation buttons: the page is drawn under it and `safe-area-inset-bottom`
   * says how far.
   */
  async coverTheBottomOfTheWindow(height: number): Promise<void> {
    this.cdpSession ??= await this.page.context().newCDPSession(this.page);
    await this.cdpSession.send("Emulation.setSafeAreaInsetsOverride", {insets: {bottom: height}});
  }

  async getKoreanWordsSplitAcrossLines(): Promise<readonly string[]> {
    return await this.page.evaluate(() => {
      const lineGapPx = 8;
      const split: string[] = [];
      const texts = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

      while (texts.nextNode()) {
        const text = texts.currentNode;
        const parent = text.parentElement;
        // A screen reader's words sit in a box too small to read, and a sheet that is closed is not on screen.
        if (parent && parent.getBoundingClientRect().width > 1 && !parent.closest("[inert]")) {
          // A line may fairly end before an opening bracket, so one starts a new word here.
          for (const word of (text.textContent ?? "").matchAll(/[^\s(]*[가-힣][^\s(]*/g)) {
            const range = document.createRange();
            range.setStart(text, word.index);
            range.setEnd(text, word.index + word[0].length);

            const tops = [...range.getClientRects()].map(rect => rect.top);
            // Hangul and Latin in one word can sit a pixel or two apart on the one line.
            if (Math.max(...tops) - Math.min(...tops) > lineGapPx) split.push(word[0]);
          }
        }
      }

      return split;
    });
  }

  async resizeWindowTo(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({width, height});
  }
}
