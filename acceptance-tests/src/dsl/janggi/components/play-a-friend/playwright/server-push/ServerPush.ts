import type {Page, Worker} from "@playwright/test";

/**
 * A push from the API's server reaching the app's real service worker. A test cannot get one from a real push service, and
 * Chromium's own way of delivering one (`ServiceWorker.deliverPushMessage`) drops it for a page with no push subscription, so the
 * `push` event is dispatched in the worker itself, carrying the bytes the server would have sent. The worker does with it what it
 * would with any. What it shows is read back from the registration, as the page would read it.
 */
export class ServerPush {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Lets the app show notifications, as a player who said yes to the browser's question has. */
  async allowNotifications(): Promise<void> {
    await this.page.context().grantPermissions(["notifications"], {origin: new URL(this.page.url()).origin});
  }

  /** Delivers `message` to the worker as the server's push to this device. */
  async receive(message: string): Promise<void> {
    const worker = await this.appsWorker();

    await worker.evaluate(data => {
      const scope = globalThis as unknown as {
        dispatchEvent: (event: Event) => boolean;
        PushEvent: new (type: string, init: {data: string}) => Event;
      };

      scope.dispatchEvent(new scope.PushEvent("push", {data}));
    }, message);
  }

  /** What each notification the app is showing says, as the browser has it. */
  async getNotificationsShown(): Promise<readonly string[]> {
    return this.page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;

      return (await registration.getNotifications()).map(notification => notification.body);
    });
  }

  private async appsWorker(): Promise<Worker> {
    const origin = new URL(this.page.url()).origin;
    const context = this.page.context();
    const running = context.serviceWorkers().find(worker => worker.url().startsWith(origin));

    return running ?? context.waitForEvent("serviceworker", worker => worker.url().startsWith(origin));
  }
}
