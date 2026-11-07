import type {Locator, Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";

/** The reading page selected by its URL, whether it replaced the game or opened beside it. */
export class ReferencesContent extends BasePage {
  private readonly footer: Locator;
  private readonly content: Locator;
  private readonly referencesToolsJump: Locator;
  private readonly heading: Locator;
  private readonly translationNotice: Locator;
  private readonly translationNoticeOriginal: Locator;
  private readonly headings: Locator;
  private readonly referencesToolsHeading: Locator;
  private readonly pageLanguageEn: Locator;

  constructor(page: Page) {
    super(page);
    this.footer = page.getByTestId("references").locator("footer");
    this.content = this.page.getByTestId("references");
    this.referencesToolsJump = this.page.getByTestId("references-tools-jump");
    this.heading = this.page.getByTestId("references").locator("h1");
    this.translationNotice = this.page.getByTestId("translation-notice");
    this.translationNoticeOriginal = this.page.getByTestId("translation-notice-original");
    this.headings = this.page.getByTestId("references").locator("h2");
    this.referencesToolsHeading = this.page.getByTestId("references-tools-heading");

    this.pageLanguageEn = this.page.getByTestId("page-language-en").locator("..");
  }

  async waitUntilReady(): Promise<void> {
    await this.content.waitFor({state: "visible"});
  }

  async followToolsWithKeyboard(): Promise<void> {
    const link = this.referencesToolsJump;
    await link.focus();
    await link.press("Enter");
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getMainHeading(): Promise<string> {
    return await this.heading.innerText();
  }

  /** What the page says of being machine translated, or an empty string where it says nothing. */
  async getTranslationNotice(): Promise<string> {
    const notice = this.translationNotice;
    if ((await notice.count()) === 0) return "";

    return ((await notice.textContent()) ?? "").trim();
  }

  /** Where the notice's link to the page it was translated from goes, as written in the page. */
  async getOriginalAddress(): Promise<string> {
    return (await this.translationNoticeOriginal.getAttribute("href")) ?? "";
  }

  async getHeadings(): Promise<string[]> {
    return await this.headings.allTextContents();
  }

  async getContent(): Promise<string> {
    return await this.content.innerText();
  }

  async getDestinationOf(id: string): Promise<string> {
    const href = (await this.page.getByTestId(id).getAttribute("href")) ?? undefined;
    if (href === undefined) throw new Error(`The reference ${id} has no destination`);

    return href;
  }

  async isToolsHeadingOnScreen(): Promise<boolean> {
    return await this.referencesToolsHeading.evaluate(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.top >= 0 && bounds.bottom <= window.innerHeight;
    });
  }

  async isFullyOnScreen(): Promise<boolean> {
    return await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  }

  /** Above the heading, and reaching the right edge of the page's content, which its footer spans. */
  async isLanguageSwitchAtTheTopRight(): Promise<boolean> {
    const languageSwitch = (await this.pageLanguageEn.boundingBox()) ?? undefined;
    if (!languageSwitch) throw new Error("The references page has no language switch");

    const heading = (await this.heading.boundingBox()) ?? undefined;
    if (!heading) throw new Error("The references page has no heading");

    const footer = (await this.footer.boundingBox()) ?? undefined;
    if (!footer) throw new Error("The references page has no footer");

    const isAboveHeading = languageSwitch.y + languageSwitch.height <= heading.y;
    const reachesRightEdge = Math.abs(languageSwitch.x + languageSwitch.width - (footer.x + footer.width)) <= 1;

    return isAboveHeading && reachesRightEdge;
  }
}
