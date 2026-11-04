import type {Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";

/** The references page, whether visited directly or opened beside the game. */
export class ReferencesPlaywright extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openReferences(): Promise<void> {
    await this.page.getByTestId("settings-open").click();

    // The link lives on the You tab, so choose it, and put the tab the player was on back after.
    const leftOn = await this.page
      .locator("[data-testid='settings-tab'][aria-selected='true']")
      .getAttribute("data-tab");
    await this.page.locator("[data-testid='settings-tab'][data-tab='You']").click();

    await this.page.getByTestId("references-open").waitFor({state: "visible"});
    const [references] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.getByTestId("references-open").click(),
    ]);
    await references.getByTestId("references").waitFor({state: "visible"});

    await this.page.locator(`[data-testid='settings-tab'][data-tab='${leftOn}']`).click();
    await this.page.getByTestId("settings-close").click();
  }

  async visitReferences(): Promise<void> {
    await this.page.goto(new URL("references.html", this.page.url()).href);
    await this.page.getByTestId("references").waitFor({state: "visible"});
  }

  /** Goes to the references' Korean page. The address is relative, so call it from a page at the root of the site. */
  async visitKoreanReferences(): Promise<void> {
    await this.page.goto(new URL("ko/references.html", this.page.url()).href);
    await this.page.getByTestId("references").waitFor({state: "visible"});
  }

  async reload(): Promise<void> {
    const references = this.referencesPage();
    await references.reload();
    await references.getByTestId("references").waitFor({state: "visible"});
  }

  async followToolsWithKeyboard(): Promise<void> {
    const link = this.referencesPage().getByTestId("references-tools-jump");
    await link.focus();
    await link.press("Enter");
  }

  async isSeparateFromGame(): Promise<boolean> {
    return this.referencesPage() !== this.page;
  }

  async getPageTitle(): Promise<string> {
    return await this.referencesPage().title();
  }

  async getMainHeading(): Promise<string> {
    return await this.referencesPage().getByTestId("references").locator("h1").innerText();
  }

  /** What the page says of being machine translated, or an empty string where it says nothing. */
  async getTranslationNotice(): Promise<string> {
    const notice = this.referencesPage().getByTestId("translation-notice");
    if ((await notice.count()) === 0) return "";

    return ((await notice.textContent()) ?? "").trim();
  }

  /** Where the notice's link to the page it was translated from goes, as written in the page. */
  async getOriginalAddress(): Promise<string> {
    return (await this.referencesPage().getByTestId("translation-notice-original").getAttribute("href")) ?? "";
  }

  async getHeadings(): Promise<string[]> {
    return await this.referencesPage().getByTestId("references").locator("h2").allTextContents();
  }

  async getContent(): Promise<string> {
    return await this.referencesPage().getByTestId("references").innerText();
  }

  async getDestinationOf(id: string): Promise<string> {
    const href = (await this.referencesPage().getByTestId(id).getAttribute("href")) ?? undefined;
    if (href === undefined) throw new Error(`The reference ${id} has no destination`);

    return href;
  }

  async isToolsHeadingOnScreen(): Promise<boolean> {
    return await this.referencesPage()
      .getByTestId("references-tools-heading")
      .evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.top >= 0 && bounds.bottom <= window.innerHeight;
      });
  }

  async isFullyOnScreen(): Promise<boolean> {
    return await this.referencesPage().evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  }

  /** Above the heading, and reaching the right edge of the page's content, which its footer spans. */
  async isLanguageSwitchAtTheTopRight(): Promise<boolean> {
    const page = this.referencesPage();
    const references = page.getByTestId("references");
    const languageSwitch = (await page.getByTestId("page-language-en").locator("..").boundingBox()) ?? undefined;
    if (!languageSwitch) throw new Error("The references page has no language switch");

    const heading = (await references.locator("h1").boundingBox()) ?? undefined;
    if (!heading) throw new Error("The references page has no heading");

    const footer = (await references.locator("footer").boundingBox()) ?? undefined;
    if (!footer) throw new Error("The references page has no footer");

    const isAboveHeading = languageSwitch.y + languageSwitch.height <= heading.y;
    const reachesRightEdge = Math.abs(languageSwitch.x + languageSwitch.width - (footer.x + footer.width)) <= 1;

    return isAboveHeading && reachesRightEdge;
  }

  private referencesPage(): Page {
    const references = this.page
      .context()
      .pages()
      .find(candidate => new URL(candidate.url()).pathname.endsWith("/references.html"));
    if (!references) throw new Error("The references page has not been opened");

    return references;
  }
}
