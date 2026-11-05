import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The You tab — the part of it that belongs to no single setting: the links to the guide and the references, the App
 * & help links out of the game, and the line naming the build.
 *
 * It holds no other component. Each setting is built by its own `*Dsl` from the page, so this is the counterpart of
 * `YouPaneDsl` and nothing else's parent.
 */
export class YouPanePlaywright extends SettingsSheetComponent {
  private readonly appVersion: Locator;

  constructor(page: Page) {
    super(page);

    this.appVersion = page.getByTestId("app-version");
  }

  async isGuideLinkedFromGame(): Promise<boolean> {
    const href = (await this.page.getByTestId("guide-open").getAttribute("href")) ?? undefined;

    return href !== undefined && new URL(href, this.page.url()).href === new URL("learn.html", this.page.url()).href;
  }

  /** Where the link to the guide in the game goes, as written in the page. */
  async getGuideAddressInGame(): Promise<string> {
    return (await this.page.getByTestId("guide-open").getAttribute("href")) ?? "";
  }

  /** Where the link to the references in the game goes, as written in the page. */
  async getReferencesAddressInGame(): Promise<string> {
    return (await this.page.getByTestId("references-open").getAttribute("href")) ?? "";
  }

  async getDeveloperWebsiteDestination(): Promise<string> {
    return await this.appHelpDestination("developer-website-open");
  }

  async getRepositoryDestination(): Promise<string> {
    return await this.appHelpDestination("repository-open");
  }

  private async appHelpDestination(testId: string): Promise<string> {
    const href = (await this.page.getByTestId(testId).getAttribute("href")) ?? undefined;
    if (href === undefined) throw new Error(`The ${testId} link has no destination`);

    return href;
  }

  /** The build the app was made from, as the You tab names it. */
  async getAppVersion(): Promise<string> {
    return ((await this.appVersion.textContent()) ?? "").trim();
  }

  /** The line that names the build, with the word for a version in front of it. */
  async getVersionWords(): Promise<string> {
    return ((await this.appVersion.locator("xpath=..").textContent()) ?? "").trim();
  }

  /** What the app and help links in the You tab say, as the player reads them. */
  async getAppHelpWords(): Promise<string> {
    return ((await this.page.getByTestId("app-help").textContent()) ?? "").trim();
  }

  async doExternalAppHelpLinksOpenSeparately(): Promise<boolean> {
    const developerWebsite = this.page.getByTestId("developer-website-open");
    const repository = this.page.getByTestId("repository-open");

    return (
      (await developerWebsite.getAttribute("target")) === "_blank" &&
      (await developerWebsite.getAttribute("rel")) === "noopener noreferrer" &&
      (await repository.getAttribute("target")) === "_blank" &&
      (await repository.getAttribute("rel")) === "noopener noreferrer"
    );
  }
}
