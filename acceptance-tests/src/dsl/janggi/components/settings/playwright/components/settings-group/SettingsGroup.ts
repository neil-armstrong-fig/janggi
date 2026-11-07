import type {Locator} from "@playwright/test";

/** A settings summary row and the content it folds open or closed. */
export class SettingsGroup {
  private readonly group: Locator;
  private readonly toggle: Locator;
  private readonly summary: Locator;

  constructor(group: Locator) {
    this.group = group;
    this.toggle = group.getByTestId("settings-group-toggle");
    this.summary = group.getByTestId("settings-group-summary");
  }

  async setOpen(open: boolean): Promise<void> {
    if ((await this.isOpen()) === open) return;
    await this.toggle.click();
  }

  async isOpen(): Promise<boolean> {
    return (await this.group.getAttribute("data-open")) === "true";
  }

  async getSummary(useLayout: boolean): Promise<string> {
    if (useLayout) return (await this.summary.innerText()).trim();
    return ((await this.summary.textContent()) ?? "").trim();
  }
}
