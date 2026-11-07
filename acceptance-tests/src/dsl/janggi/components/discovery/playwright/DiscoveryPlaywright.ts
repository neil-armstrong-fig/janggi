import type {Locator, Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";
import type {LanguageAlternates} from "@src/dsl/janggi/components/discovery/types/LanguageAlternates";
import type {SearchData} from "@src/dsl/janggi/components/discovery/playwright/types/SearchData";

/**
 * The locators behind `DiscoveryDsl` — what the page tells search engines, crawlers and link previews: its head, the
 * page as first served before any script runs, its structured data, and the sitemap.
 */
export class DiscoveryPlaywright extends BasePage {
  private readonly description: Locator;
  private readonly canonical: Locator;
  private readonly socialImage: Locator;
  private readonly structuredData: Locator;

  constructor(page: Page) {
    super(page);

    this.description = this.page.locator("meta[name='description']");
    this.canonical = this.page.locator("link[rel='canonical']");
    this.socialImage = this.page.locator("meta[property='og:image']");
    this.structuredData = this.page.locator("script[type='application/ld+json']");
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getPageDescription(): Promise<string> {
    return (await this.description.getAttribute("content")) ?? "";
  }

  async getCanonicalAddress(): Promise<string> {
    return (await this.canonical.getAttribute("href")) ?? "";
  }

  /** The twins the page names in its head, by `hreflang`. */
  async getLanguageAlternates(): Promise<LanguageAlternates> {
    return await this.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("link[rel='alternate'][hreflang]"));

      return Object.fromEntries(
        links.map(link => [link.getAttribute("hreflang") ?? "", link.getAttribute("href") ?? ""]),
      );
    });
  }

  /** The twins the sitemap names for the Korean page, by `hreflang`. */
  async getSitemapLanguageAlternatesOfTheKoreanGame(): Promise<LanguageAlternates> {
    return await this.getSitemapLanguageAlternatesOfTheEntryEndingWith("/ko/");
  }

  /** The twins the sitemap names for the Korean guide, by `hreflang`. */
  async getSitemapLanguageAlternatesOfTheKoreanGuide(): Promise<LanguageAlternates> {
    return await this.getSitemapLanguageAlternatesOfTheEntryEndingWith("/ko/learn.html");
  }

  /** The twins the sitemap names for the Korean references, by `hreflang`. */
  async getSitemapLanguageAlternatesOfTheKoreanReferences(): Promise<LanguageAlternates> {
    return await this.getSitemapLanguageAlternatesOfTheEntryEndingWith("/ko/references.html");
  }

  private async getSitemapLanguageAlternatesOfTheEntryEndingWith(ending: string): Promise<LanguageAlternates> {
    const sitemap = await this.sitemapText();
    return await this.page.evaluate(
      ([source, suffix]) => {
        const document = new DOMParser().parseFromString(source ?? "", "application/xml");
        const entry = Array.from(document.getElementsByTagNameNS("*", "url")).find(candidate => {
          return candidate.getElementsByTagNameNS("*", "loc")[0]?.textContent?.endsWith(suffix ?? "");
        });
        const links = Array.from(entry?.getElementsByTagNameNS("*", "link") ?? []);
        return Object.fromEntries(
          links.map(link => [link.getAttribute("hreflang") ?? "", link.getAttribute("href") ?? ""]),
        );
      },
      [sitemap, ending],
    );
  }

  async getSocialImageAddress(): Promise<string> {
    return (await this.socialImage.getAttribute("content")) ?? "";
  }

  /** The page as a crawler that runs no scripts receives it — inside `#root`, before React replaces it. */
  async getMainHeadingServedToSearchEngines(): Promise<string> {
    const root = await this.getRootServedToSearchEngines();

    return /<h1[^>]*>([^<]*)<\/h1>/.exec(root)?.[1] ?? "";
  }

  async getTextServedToSearchEngines(): Promise<string> {
    return (await this.getRootServedToSearchEngines()).replace(/<[^>]*>/g, " ");
  }

  async isGuideLinkedInPageServedToSearchEngines(): Promise<boolean> {
    const root = await this.getRootServedToSearchEngines();

    return /<a[^>]+href="learn\.html"/.test(root);
  }

  /** Where the guide link in the page served to search engines goes, or an empty string if there is none. */
  async getGuideAddressInPageServedToSearchEngines(): Promise<string> {
    const root = await this.getRootServedToSearchEngines();

    return /<a[^>]+href="([^"]*learn\.html)"/.exec(root)?.[1] ?? "";
  }

  /** Where the references link in the page served to search engines goes, or an empty string if there is none. */
  async getReferencesAddressInPageServedToSearchEngines(): Promise<string> {
    const root = await this.getRootServedToSearchEngines();

    return /<a[^>]+href="([^"]*references\.html)"/.exec(root)?.[1] ?? "";
  }

  /**
   * Where the link to the game in the other language goes, in the page served to search engines, or an empty string
   * if there is none. A `hreflang` in the head names a twin but is not a link a crawler follows.
   */
  async getOtherLanguageAddressInPageServedToSearchEngines(): Promise<string> {
    const root = await this.getRootServedToSearchEngines();

    return /<a[^>]+href="([^"]*)"[^>]*hreflang="/i.exec(root)?.[1] ?? "";
  }

  async isEachPolicyLinkedInPageServedToSearchEngines(): Promise<boolean> {
    const root = await this.getRootServedToSearchEngines();

    return /<a[^>]+href="privacy\.html"/.test(root) && /<a[^>]+href="terms\.html"/.test(root);
  }

  private async getRootServedToSearchEngines(): Promise<string> {
    const response = await this.page.request.get(this.page.url());
    const html = await response.text();

    // What follows the root is a `noscript` on the game's pages, a `script` in development, and the end of the body in a
    // build, where the script has moved to the head.
    return /<div id="root">([\s\S]*?)<\/div>\s*<(?:noscript|script|\/body)\b/.exec(html)?.[1] ?? "";
  }

  async isIdentifiedAsAFreeWebGame(): Promise<boolean> {
    const content = (await this.structuredData.textContent()) ?? undefined;
    if (content === undefined) return false;

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

  async getSearchDataLanguage(): Promise<unknown> {
    const searchData = await this.getSearchData();
    if (searchData.inLanguage !== undefined) return searchData.inLanguage;

    return searchData["@graph"]?.find(node => node.inLanguage !== undefined)?.inLanguage;
  }

  async getSearchDataName(): Promise<unknown> {
    return (await this.getSearchData()).name;
  }

  private async getSearchData(): Promise<SearchData> {
    const content = await this.structuredData.textContent();

    return JSON.parse(content ?? "{}") as SearchData;
  }

  async isSitemapAdvertisedToCrawlers(): Promise<boolean> {
    const response = await this.page.request.get(new URL("robots.txt", this.page.url()).href);
    if (!response.ok()) return false;

    const robots = await response.text();

    return (
      /^User-agent: \*$/m.test(robots) &&
      /^Allow: \/$/m.test(robots) &&
      robots.includes("Sitemap: https://janggi.neilarmstrong.dev/sitemap.xml")
    );
  }

  async isListedInSitemap(): Promise<boolean> {
    const sitemap = await this.sitemapText();
    return (
      sitemap.includes("https://janggi.neilarmstrong.dev/") &&
      sitemap.includes("https://janggi.neilarmstrong.dev/learn.html")
    );
  }

  async isEachPolicyListedInSitemap(): Promise<boolean> {
    const sitemap = await this.sitemapText();
    return (
      sitemap.includes("https://janggi.neilarmstrong.dev/privacy.html") &&
      sitemap.includes("https://janggi.neilarmstrong.dev/terms.html")
    );
  }

  /** Every `url` in the sitemap carries a `lastmod` that is a date, and there is at least one. */
  async isEverySitemapEntryDated(): Promise<boolean> {
    const sitemap = await this.sitemapText();
    return await this.page.evaluate(source => {
      const document = new DOMParser().parseFromString(source, "application/xml");
      const entries = Array.from(document.getElementsByTagNameNS("*", "url"));
      return (
        entries.length > 0 &&
        entries.every(entry => {
          return /^\d{4}-\d{2}-\d{2}$/.test(entry.getElementsByTagNameNS("*", "lastmod")[0]?.textContent ?? "");
        })
      );
    }, sitemap);
  }
  private async sitemapText(): Promise<string> {
    const address = new URL("sitemap.xml", this.page.url()).href;

    return await this.page.evaluate(async url => {
      const response = await fetch(url);
      if (!response.ok) return "";

      return await response.text();
    }, address);
  }
}
