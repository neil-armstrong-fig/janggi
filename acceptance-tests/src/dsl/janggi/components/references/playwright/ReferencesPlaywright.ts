import type {Locator, Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";
import {ReferencesContent} from "@src/dsl/janggi/components/references/playwright/content/ReferencesContent";

/** The references page, whether visited directly or opened beside the game. */
export class ReferencesPlaywright extends BasePage {
  private readonly referencesOpen: Locator;
  private readonly references: Locator;

  constructor(page: Page) {
    super(page);

    this.referencesOpen = this.page.getByTestId("references-open");
    this.references = this.page.getByTestId("references");
  }

  async openReferences(): Promise<void> {
    const [references] = await Promise.all([this.page.context().waitForEvent("page"), this.referencesOpen.click()]);
    await new ReferencesContent(references).waitUntilReady();
  }

  async visitReferences(): Promise<void> {
    await this.page.goto(new URL("references.html", this.page.url()).href);
    await this.references.waitFor({state: "visible"});
  }

  /** Goes to the references' Korean page. The address is relative, so call it from a page at the root of the site. */
  async visitKoreanReferences(): Promise<void> {
    await this.page.goto(new URL("ko/references.html", this.page.url()).href);
    await this.references.waitFor({state: "visible"});
  }

  async reload(): Promise<void> {
    const references = this.referencesPage();
    await references.reload();
    await new ReferencesContent(references).waitUntilReady();
  }

  async isSeparateFromGame(): Promise<boolean> {
    return this.referencesPage() !== this.page;
  }

  async followToolsWithKeyboard(): Promise<void> {
    return await this.content().followToolsWithKeyboard();
  }

  async getPageTitle(): Promise<string> {
    return await this.content().getPageTitle();
  }

  async getMainHeading(): Promise<string> {
    return await this.content().getMainHeading();
  }

  async getTranslationNotice(): Promise<string> {
    return await this.content().getTranslationNotice();
  }

  async getOriginalAddress(): Promise<string> {
    return await this.content().getOriginalAddress();
  }

  async getHeadings(): Promise<string[]> {
    return await this.content().getHeadings();
  }

  async getContent(): Promise<string> {
    return await this.content().getContent();
  }

  async getDestinationOf(id: string): Promise<string> {
    return await this.content().getDestinationOf(id);
  }

  async isToolsHeadingOnScreen(): Promise<boolean> {
    return await this.content().isToolsHeadingOnScreen();
  }

  async isFullyOnScreen(): Promise<boolean> {
    return await this.content().isFullyOnScreen();
  }

  async isLanguageSwitchAtTheTopRight(): Promise<boolean> {
    return await this.content().isLanguageSwitchAtTheTopRight();
  }

  private content(): ReferencesContent {
    return new ReferencesContent(this.referencesPage());
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
