import type {Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";

/** The references page, whether visited directly or opened beside the game. */
export class ReferencesPlaywright extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openReferences(): Promise<void> {
    await this.page.getByTestId("settings-open").click();
    await this.page.getByTestId("references-open").waitFor({state: "visible"});
    const [references] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.getByTestId("references-open").click(),
    ]);
    await references.getByTestId("references").waitFor({state: "visible"});
    await this.page.getByTestId("settings-close").click();
  }

  async visitReferences(): Promise<void> {
    await this.page.goto(new URL("references.html", this.page.url()).href);
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

  async getHeadings(): Promise<string[]> {
    return await this.referencesPage().getByTestId("references").locator("h2").allTextContents();
  }

  async getContent(): Promise<string> {
    return await this.referencesPage().getByTestId("references").innerText();
  }

  async getDestinationOf(id: string): Promise<string> {
    const href = await this.referencesPage().getByTestId(id).getAttribute("href");
    if (href === null) throw new Error(`The reference ${id} has no destination`);
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

  private referencesPage(): Page {
    const references = this.page
      .context()
      .pages()
      .find(candidate => new URL(candidate.url()).pathname.endsWith("/references.html"));
    if (!references) throw new Error("The references page has not been opened");

    return references;
  }
}
