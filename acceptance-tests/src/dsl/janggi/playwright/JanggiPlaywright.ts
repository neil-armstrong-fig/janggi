import type {Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";
import type {InstallationAppearance, InstallationIcon} from "@src/dsl/janggi/types/InstallationAppearance";
import type {InstallationManifest} from "@src/dsl/janggi/types/InstallationManifest";
import type {SearchData} from "@src/dsl/janggi/types/SearchData";

/**
 * How long a first visit may take to come back isolated. The service worker precaches the engine's
 * wasm before it takes control, which is seconds on a slow runner — past the config's action timeout.
 */
const ISOLATION_TIMEOUT_MS = 15_000;

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
  constructor(page: Page) {
    super(page);
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
   * under a request it has paused fails that request.
   */
  async restoreTheBotsEngine(): Promise<void> {
    await this.page.evaluate(name => Reflect.set(globalThis, name, true), ENGINE_MAY_ARRIVE);
    await this.page.unrouteAll({behavior: "wait"});
  }

  /**
   * Where the app's service worker is running it answers the engine's script out of its precache, and a
   * route on the page never sees the request. Bypassing it sends every request over the network instead —
   * and the server sends the isolation headers itself, so the page stays isolated.
   */
  private async reachTheEngineOnlyThroughTheNetwork(): Promise<void> {
    const session = await this.page.context().newCDPSession(this.page);
    await session.send("Network.enable");
    await session.send("Network.setBypassServiceWorker", {bypass: true});
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
    return (await this.page.locator("html").getAttribute("data-install-prompted")) === "true";
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getInstallationAppearance(): Promise<InstallationAppearance> {
    const manifestPath = await this.page.locator("link[rel='manifest']").getAttribute("href");
    if (!manifestPath) throw new Error("The page has no web app manifest");

    const manifestAddress = new URL(manifestPath, this.page.url()).href;
    const installationManifest = await this.installationManifestAt(manifestAddress);
    const installationIcons = await Promise.all(
      (installationManifest.icons ?? []).map(async icon => ({
        ...(await this.installationIconAt(new URL(icon.src, manifestAddress).href)),
        purpose: icon.purpose ?? "any",
      })),
    );

    const appleTouchIconPath = await this.page.locator("link[rel='apple-touch-icon']").getAttribute("href");
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

  async getPageDescription(): Promise<string> {
    return (await this.page.locator("meta[name='description']").getAttribute("content")) ?? "";
  }

  async getCanonicalAddress(): Promise<string> {
    return (await this.page.locator("link[rel='canonical']").getAttribute("href")) ?? "";
  }

  async getMainHeading(): Promise<string> {
    return await this.page.locator("h1").innerText();
  }

  async isIdentifiedAsAFreeWebGame(): Promise<boolean> {
    const content = await this.page.locator("script[type='application/ld+json']").textContent();
    if (content === null) return false;

    const searchData = JSON.parse(content) as SearchData;

    return (
      searchData.name === "Janggi" &&
      Array.isArray(searchData["@type"]) &&
      searchData["@type"].includes("VideoGame") &&
      searchData["@type"].includes("WebApplication") &&
      searchData.applicationCategory === "GameApplication" &&
      searchData.offers?.price === "0" &&
      searchData.offers.priceCurrency === "USD"
    );
  }

  async isListedInSitemap(): Promise<boolean> {
    const sitemapAddress = new URL("sitemap.xml", this.page.url()).href;
    const sitemap = await this.page.evaluate(async address => {
      const response = await fetch(address);
      if (!response.ok) return "";

      return await response.text();
    }, sitemapAddress);

    return (
      sitemap.includes("https://neil-armstrong-fig.github.io/janggi/") &&
      sitemap.includes("https://neil-armstrong-fig.github.io/janggi/learn.html")
    );
  }

  async resizeWindowTo(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({width, height});
  }
}
