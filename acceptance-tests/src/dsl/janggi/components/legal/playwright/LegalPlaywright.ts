import type {Locator, Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";

/** Far longer than a wheel takes to land, and short enough that a page which cannot scroll answers promptly. */
const SCROLLS_WITHIN_MS = 2_000;

/** The public privacy policy and terms, whether reached from sign-in or visited directly. */
export class LegalPlaywright extends BasePage {
  private readonly privacyLink: Locator;
  private readonly termsLink: Locator;

  constructor(page: Page) {
    super(page);

    this.privacyLink = page.getByTestId("privacy-open");
    this.termsLink = page.getByTestId("terms-open");
  }

  async visitPrivacyPolicy(): Promise<void> {
    await this.visit("privacy.html", "privacy");
  }

  async visitTermsOfService(): Promise<void> {
    await this.visit("terms.html", "terms");
  }

  private async visit(path: string, kind: string): Promise<void> {
    await this.page.goto(new URL(path, this.page.url()).href);
    await this.page.locator(`[data-testid='legal'][data-kind='${kind}']`).waitFor({state: "visible"});
  }

  async isEachPolicyLinkedFromSignIn(): Promise<boolean> {
    return await this.withPolicyLinks(async () => {
      const privacy = await this.privacyLink.getAttribute("href");
      const terms = await this.termsLink.getAttribute("href");

      return privacy?.endsWith("/privacy.html") === true && terms?.endsWith("/terms.html") === true;
    });
  }

  async canPoliciesOpenSeparatelyFromTheGame(): Promise<boolean> {
    return await this.withPolicyLinks(async () => {
      const links = [this.privacyLink, this.termsLink];
      const targets = await Promise.all(links.map(async link => await link.getAttribute("target")));
      const relations = await Promise.all(links.map(async link => await link.getAttribute("rel")));

      return (
        targets.every(target => target === "_blank") && relations.every(relation => relation === "noopener noreferrer")
      );
    });
  }

  private async withPolicyLinks<Answer>(question: () => Promise<Answer>): Promise<Answer> {
    await this.page.getByTestId("settings-open").click();

    const leftOn = await this.page
      .locator("[data-testid='settings-tab'][aria-selected='true']")
      .getAttribute("data-tab");
    await this.page.locator("[data-testid='settings-tab'][data-tab='You']").click();
    const pane = this.page.getByTestId("settings-pane").and(this.page.locator('[data-pane="You"]'));
    const previousName = await this.openGroupName(pane);
    const account = pane.getByTestId("settings-group").and(this.page.locator('[data-group="Account"]'));
    const needsOpening = (await account.getAttribute("data-open")) !== "true";
    if (needsOpening) await account.getByTestId("settings-group-toggle").click();
    await this.privacyLink.waitFor({state: "visible"});

    const answer = await question();

    if (needsOpening) {
      if (previousName === undefined) {
        await account.getByTestId("settings-group-toggle").click();
      } else {
        await pane
          .getByTestId("settings-group")
          .and(this.page.locator(`[data-group="${previousName}"]`))
          .getByTestId("settings-group-toggle")
          .click();
      }
    }

    await this.page.locator(`[data-testid='settings-tab'][data-tab='${leftOn}']`).click();
    await this.page.getByTestId("settings-close").click();

    return answer;
  }

  private async openGroupName(pane: Locator): Promise<string | undefined> {
    const open = pane.locator('[data-testid="settings-group"][data-open="true"]');
    if ((await open.count()) === 0) return undefined;

    return (await open.getAttribute("data-group")) ?? undefined;
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCanonicalAddress(): Promise<string> {
    return (await this.page.locator("link[rel='canonical']").getAttribute("href")) ?? "";
  }

  async getHeadings(): Promise<string[]> {
    return await this.page.getByTestId("legal").locator("h2").allTextContents();
  }

  async getContent(): Promise<string> {
    return await this.page.getByTestId("legal").innerText();
  }

  async isFullyOnScreen(): Promise<boolean> {
    return await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  }

  async canScrollToTheEnd(): Promise<boolean> {
    await this.page.setViewportSize({width: 390, height: 500});
    await this.page.mouse.move(195, 250);
    await this.page.mouse.wheel(0, 100_000);

    const footerLinks = this.page.getByRole("navigation", {name: "Legal navigation"});
    await footerLinks.waitFor({state: "visible"});

    // A wheel is handed to the page and applied a frame or so later, so the end is waited for rather than sampled.
    try {
      await this.page.waitForFunction(
        element => {
          const bottom = element?.getBoundingClientRect().bottom ?? 0;

          return bottom > 0 && bottom <= window.innerHeight;
        },
        await footerLinks.elementHandle(),
        {timeout: SCROLLS_WITHIN_MS},
      );

      return true;
    } catch {
      return false;
    }
  }
}
