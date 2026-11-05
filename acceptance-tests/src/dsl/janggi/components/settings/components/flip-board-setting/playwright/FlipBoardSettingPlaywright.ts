import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The "Flip board for Han" switch, and what its (?) unfolds. */
export class FlipBoardSettingPlaywright extends SettingsSheetComponent {
  private readonly toggle: Locator;
  private readonly explain: Locator;
  private readonly explanation: Locator;

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("flip-board-toggle");
    this.explain = page.getByTestId("flip-board-explain");
    this.explanation = page.getByTestId("flip-board-explanation");
  }

  async isOn(): Promise<boolean> {
    return (await this.toggle.getAttribute("aria-pressed")) === "true";
  }

  async setTo(on: boolean): Promise<void> {
    if ((await this.isOn()) === on) return;

    await this.inSheet(this.toggle, async () => {
      await this.toggle.click();
    });
  }

  async toggleExplanation(): Promise<void> {
    await this.inSheet(this.explain, () => this.explain.click());
  }

  /** Read off the panel itself, which is only drawn while it is unfolded. */
  async isExplanationShown(): Promise<boolean> {
    await this.toggle.waitFor({state: "attached"});

    return (await this.explanation.count()) > 0;
  }

  async getExplanationWords(): Promise<string> {
    let words = "";
    await this.inSheet(this.explain, async () => {
      words = await this.explanation.innerText();
    });

    return words;
  }
}
