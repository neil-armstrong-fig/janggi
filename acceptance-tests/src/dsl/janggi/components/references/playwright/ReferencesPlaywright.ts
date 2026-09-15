import type {Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";

/** The reading tab and the game it was opened from. Popups stay inside this layer. */
export class ReferencesPlaywright extends BasePage {
  private reading?: Page;
  private gameUrl = "";

  constructor(page: Page) {
    super(page);
  }

  async openReferences(): Promise<void> {
    this.gameUrl = this.page.url();
    await this.page.getByTestId("settings-open").click();
    await this.page.getByTestId("references-open").waitFor({state: "visible"});
    const [opened] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.getByTestId("references-open").click(),
    ]);
    this.reading = opened;
    await this.reading.getByTestId("references").waitFor({state: "visible"});
    await this.page.getByTestId("settings-close").click();
  }

  async visitReferences(): Promise<void> {
    this.reading = await this.page.context().newPage();
    await this.reading.goto(new URL("references.html", this.page.url()).href);
    await this.reading.getByTestId("references").waitFor({state: "visible"});
  }

  async reload(): Promise<void> {
    await this.readingPage().reload();
    await this.readingPage().getByTestId("references").waitFor({state: "visible"});
  }

  async followToolsWithKeyboard(): Promise<void> {
    const link = this.readingPage().getByTestId("references-tools-jump");
    await link.focus();
    await link.press("Enter");
  }

  async isSeparateFromGame(): Promise<boolean> {
    return this.readingPage() !== this.page && this.page.url() === this.gameUrl;
  }

  async headings(): Promise<string[]> {
    return await this.readingPage().getByTestId("references").locator("h2").allTextContents();
  }

  async content(): Promise<string> {
    return await this.readingPage().getByTestId("references").innerText();
  }

  async destinationOf(id: string): Promise<string> {
    const href = await this.readingPage().getByTestId(id).getAttribute("href");
    if (href === null) throw new Error(`The reference ${id} has no destination`);
    return href;
  }

  async isToolsHeadingOnScreen(): Promise<boolean> {
    return await this.readingPage()
      .getByTestId("references-tools-heading")
      .evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.top >= 0 && bounds.bottom <= window.innerHeight;
      });
  }

  async fitsWindow(): Promise<boolean> {
    return await this.readingPage().evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  }

  private readingPage(): Page {
    if (!this.reading) throw new Error("The references page has not been opened");
    return this.reading;
  }
}
