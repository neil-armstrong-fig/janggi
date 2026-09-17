import type {Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";

/**
 * How long a first visit may take to come back isolated. The service worker precaches the engine's
 * wasm before it takes control, which is seconds on a slow runner — past the config's action timeout.
 */
const ISOLATION_TIMEOUT_MS = 15_000;

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
  /** Declared only because `BasePage`'s constructor is protected; there is nothing of its own to set up. */
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

  async reload(): Promise<void> {
    await this.page.reload();
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

interface SearchData {
  readonly "@type"?: unknown;
  readonly name?: unknown;
  readonly applicationCategory?: unknown;
  readonly offers?: OfferData;
}

interface OfferData {
  readonly price?: unknown;
  readonly priceCurrency?: unknown;
}
