import {DslError} from "@src/dsl/errors/DslError";
import {InstallButtonPlaywright} from "@src/dsl/janggi/components/settings/components/install-button/playwright/InstallButtonPlaywright";
import type {Page} from "@playwright/test";

export class InstallButtonDsl {
  private readonly installButton: InstallButtonPlaywright;

  constructor(page: Page) {
    this.installButton = new InstallButtonPlaywright(page);
  }

  async isShown(): Promise<boolean> {
    try {
      return await this.installButton.isShown();
    } catch (error) {
      throw new DslError("Failed to check whether Settings offers to install Janggi", error);
    }
  }

  async choose(): Promise<void> {
    try {
      await this.installButton.choose();
    } catch (error) {
      throw new DslError("Failed to choose to install Janggi from Settings", error);
    }
  }
}
