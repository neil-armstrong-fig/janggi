import type {PushWorkerScope} from "@src/dsl/janggi/components/play-a-friend/playwright/server-push/types/PushWorkerScope";
import type {Page, Worker} from "@playwright/test";

/**
 * A push from the API's server reaching the app's real service worker. A test cannot get one from a real push service, and
 * Chromium's own way of delivering one (`ServiceWorker.deliverPushMessage`) drops it for a page with no push subscription, so the
 * `push` event is dispatched in the worker itself, carrying the bytes the server would have sent. The worker does with it what it
 * would with any. What it shows is read back from the registration, as the page would read it.
 *
 * Delivering waits for what the worker hands to `waitUntil`, as the browser would for a real push, so the worker has finished showing
 * the notification before anything reads the list, and a worker that fails to show one fails the delivery. Without the wait the list
 * intermittently stays empty for good, and it takes `playwright.pwa.config.ts` keeping notifications in the browser as well to end that.
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

    await worker.evaluate(async data => {
      const scope = globalThis as unknown as PushWorkerScope;
      const handling: Promise<unknown>[] = [];
      const event = new scope.PushEvent("push", {data});

      Object.defineProperty(event, "waitUntil", {
        value: (promise: Promise<unknown>) => {
          handling.push(promise);
        },
      });
      scope.dispatchEvent(event);
      await Promise.all(handling);
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
