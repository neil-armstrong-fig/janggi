import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import {ReleaseUpdatePlaywright} from "@src/dsl/janggi/components/release-update/playwright/ReleaseUpdatePlaywright";

/** A new app release waiting to replace the one currently on screen. */
export class ReleaseUpdateDsl {
  private readonly releaseUpdate: ReleaseUpdatePlaywright;

  constructor(page: Page) {
    this.releaseUpdate = new ReleaseUpdatePlaywright(page);
  }

  async makeAvailable(): Promise<void> {
    try {
      await this.releaseUpdate.makeAvailable();
    } catch (error) {
      throw new DslError("Failed to make another app release available", error);
    }
  }

  async refresh(): Promise<void> {
    try {
      await this.releaseUpdate.refresh();
    } catch (error) {
      throw new DslError("Failed to refresh to the available app release", error);
    }
  }

  async leaveUntilLater(): Promise<void> {
    try {
      await this.releaseUpdate.leaveUntilLater();
    } catch (error) {
      throw new DslError("Failed to leave the available app release until later", error);
    }
  }

  async isOffered(): Promise<boolean> {
    try {
      return await this.releaseUpdate.isOffered();
    } catch (error) {
      throw new DslError("Failed to check whether the app offers the available release", error);
    }
  }

  async isDismissed(): Promise<boolean> {
    try {
      return await this.releaseUpdate.isDismissed();
    } catch (error) {
      throw new DslError("Failed to check whether the available release has been left until later", error);
    }
  }

  async isWaiting(): Promise<boolean> {
    try {
      return await this.releaseUpdate.isWaiting();
    } catch (error) {
      throw new DslError("Failed to check whether the available app release is waiting", error);
    }
  }

  async isAvailableReleaseRunning(): Promise<boolean> {
    try {
      return await this.releaseUpdate.isAvailableReleaseRunning();
    } catch (error) {
      throw new DslError("Failed to check whether the available app release is running", error);
    }
  }
}
