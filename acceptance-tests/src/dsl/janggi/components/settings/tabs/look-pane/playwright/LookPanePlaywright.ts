import type {GroupAppearance} from "@src/dsl/janggi/components/settings/types/GroupAppearance";
import type {LookGroupName} from "@janggi/shared/janggi/settings/LookGroupName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {Page} from "@playwright/test";

/** The Look pane's own settings queries and actions. */
export class LookPanePlaywright extends SettingsSheetComponent {
  // The base constructor is protected, so the pane needs a public constructor.
  constructor(page: Page) {
    super(page);
  }

  async getGroupAppearance(name: LookGroupName): Promise<GroupAppearance> {
    return await this.readGroupAppearance(name);
  }

  async isGroupOpen(name: LookGroupName): Promise<boolean> {
    return (await this.groupNamed(name).getAttribute("data-open")) === "true";
  }

  async getGroupSummary(name: LookGroupName): Promise<string> {
    return ((await this.groupNamed(name).getByTestId("settings-group-summary").textContent()) ?? "").trim();
  }

  async openGroup(name: LookGroupName): Promise<void> {
    const toggle = this.groupNamed(name).getByTestId("settings-group-toggle");

    await this.inSheet(toggle, async () => {
      if (!(await this.isGroupOpen(name))) await toggle.click();
    });
  }

  async closeGroup(name: LookGroupName): Promise<void> {
    const toggle = this.groupNamed(name).getByTestId("settings-group-toggle");

    await this.inSheet(toggle, async () => {
      if (await this.isGroupOpen(name)) await toggle.click();
    });
  }
}
