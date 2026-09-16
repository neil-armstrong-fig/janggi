import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

const ACCEPTANCE_RELEASE_PARAMETER = "acceptance-release";

/** The release notice and the real service-worker registration beneath it. */
export class ReleaseUpdatePlaywright extends BaseComponent {
  private readonly notice: Locator;
  private readonly refreshButton: Locator;
  private readonly laterButton: Locator;

  constructor(page: Page) {
    super(page);
    this.notice = page.getByTestId("release-update");
    this.refreshButton = page.getByTestId("release-update-refresh");
    this.laterButton = page.getByTestId("release-update-later");
  }

  async makeAvailable(): Promise<void> {
    await this.registerAvailableRelease();
    await this.waitForAvailableReleaseToInstall();
  }

  private async registerAvailableRelease(): Promise<void> {
    await this.page.evaluate(async parameter => {
      const current = await navigator.serviceWorker.ready;
      if (!current.active) throw new Error("The app has no active service worker");

      const releaseUrl = new URL(current.active.scriptURL);
      releaseUrl.searchParams.set(parameter, "true");
      await navigator.serviceWorker.register(releaseUrl, {scope: current.scope, updateViaCache: "none"});
    }, ACCEPTANCE_RELEASE_PARAMETER);
  }

  private async waitForAvailableReleaseToInstall(): Promise<void> {
    await this.page.waitForFunction(async parameter => {
      const registration = await navigator.serviceWorker.getRegistration();
      const release = [registration?.installing, registration?.waiting, registration?.active].find(
        worker => worker && new URL(worker.scriptURL).searchParams.has(parameter),
      );

      return release?.state === "installed" || release?.state === "activated";
    }, ACCEPTANCE_RELEASE_PARAMETER);
  }

  async refresh(): Promise<void> {
    await Promise.all([
      this.page.waitForEvent("framenavigated", frame => frame === this.page.mainFrame()),
      this.refreshButton.click(),
    ]);
    await this.page.waitForLoadState();
  }

  async leaveUntilLater(): Promise<void> {
    await this.laterButton.click();
  }

  async isOffered(): Promise<boolean> {
    try {
      await this.notice.waitFor({state: "visible"});
      return true;
    } catch {
      return false;
    }
  }

  async isDismissed(): Promise<boolean> {
    try {
      await this.notice.waitFor({state: "hidden"});
      return true;
    } catch {
      return false;
    }
  }

  async isWaiting(): Promise<boolean> {
    return await this.availableReleaseIsWaiting();
  }

  private async availableReleaseIsWaiting(): Promise<boolean> {
    return await this.page.evaluate(async parameter => {
      const registration = await navigator.serviceWorker.getRegistration();

      return Boolean(registration?.waiting && new URL(registration.waiting.scriptURL).searchParams.has(parameter));
    }, ACCEPTANCE_RELEASE_PARAMETER);
  }

  async isAvailableReleaseRunning(): Promise<boolean> {
    return await this.availableReleaseIsRunning();
  }

  private async availableReleaseIsRunning(): Promise<boolean> {
    return await this.page.evaluate(parameter => {
      const controller = navigator.serviceWorker.controller;

      return Boolean(controller && new URL(controller.scriptURL).searchParams.has(parameter));
    }, ACCEPTANCE_RELEASE_PARAMETER);
  }
}
