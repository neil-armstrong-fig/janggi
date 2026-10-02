import type {ApiRequest} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/ApiRequest";
import type {Route} from "@playwright/test";
import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";

interface StoredData {
  version: number;
  blob: string;
}

/** Where the real server sends the player back to: the address the app asked for, if it is on the site, and else the site. */
function returnAddress(url: URL, siteOrigin: string): string {
  const asked = url.searchParams.get("return");

  try {
    return asked !== null && new URL(asked).origin === siteOrigin ? asked : `${siteOrigin}/`;
  } catch {
    return `${siteOrigin}/`;
  }
}

/** The name a new account is given, as the real server gives one of its own making. */
const FIRST_NAME = "Kim Yu-sin";

/**
 * The API as the app meets it, and Google behind it, standing in for both so no spec reaches a real one.
 *
 * It is the world outside the browser, so it keeps what a server would: whether a Google session exists, what
 * each player's synced data is and what has been asked of it. That is the one place a `*Playwright` holds
 * state between calls, and it is never read back as a fact about the page. It answers in the shape the Worker
 * does (`api/AGENTS.md`), CORS included, because a browser refuses a cross-origin answer without it and a stand-in
 * that skipped it would pass specs the real thing fails.
 *
 * Signing in collapses Google's consent and the Worker's callback into the redirect back to the site that they end in.
 */
export class FakeApi {
  /** Which devices hold a Google session. Two devices share one server and one account, and each signs in alone. */
  private readonly signedIn = new Set<object>();
  private down = false;
  private stored: StoredData | undefined;
  /** The name the account was given when it was made, until the player changes it; none before the first sign-in. */
  private displayName: string | undefined;
  private readonly requests: ApiRequest[] = [];

  getRequests(): readonly ApiRequest[] {
    return this.requests;
  }

  /** From now on every call fails the way the free plan's daily cap does, with a 503. */
  cutOff(): void {
    this.down = true;
  }

  restore(): void {
    this.down = false;
  }

  /** Forgets a device's Google session, as a browser that has never signed in here would have. */
  forgetTheSession(device: object): void {
    this.signedIn.delete(device);
  }

  async answer(route: Route, siteOrigin: string, device: object): Promise<void> {
    const request = route.request();
    const url = new URL(request.url());
    const cors = {
      "Access-Control-Allow-Origin": siteOrigin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, PUT, POST, PATCH, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, If-Match",
      Vary: "Origin",
    };

    this.requests.push(`${request.method()} ${url.pathname}`);

    if (request.method() === "OPTIONS") {
      await route.fulfill({status: 204, headers: cors});
      return;
    }

    if (this.down) {
      await route.fulfill({status: 503, headers: cors});
      return;
    }

    if (request.method() === "GET" && url.pathname === "/api/auth/google") {
      this.signedIn.add(device);
      this.displayName ??= FIRST_NAME;
      await route.fulfill({status: 302, headers: {Location: returnAddress(url, siteOrigin)}});
      return;
    }

    if (!this.signedIn.has(device)) {
      await route.fulfill({status: 401, headers: cors});
      return;
    }

    await this.answerSignedIn(route, url.pathname, cors, device);
  }

  private async answerSignedIn(
    route: Route,
    path: string,
    headers: Record<string, string>,
    device: object,
  ): Promise<void> {
    const request = route.request();
    const method = request.method();

    if (method === "GET" && path === "/api/me") {
      await route.fulfill({status: 200, headers, json: {displayName: this.displayName}});
    } else if (method === "PATCH" && path === "/api/me") {
      await this.rename(route, headers);
    } else if (method === "GET" && path === "/api/data") {
      await route.fulfill({
        status: 200,
        headers,
        json: {version: this.stored?.version ?? 0, blob: this.stored?.blob ?? null},
      });
    } else if (method === "PUT" && path === "/api/data") {
      await this.store(route, headers);
    } else if (method === "POST" && path === "/api/auth/logout") {
      this.signedIn.delete(device);
      await route.fulfill({status: 204, headers});
    } else if (method === "DELETE" && path === "/api/account") {
      this.signedIn.delete(device);
      this.stored = undefined;
      this.displayName = undefined;
      await route.fulfill({status: 204, headers});
    } else {
      await route.fulfill({status: 404, headers});
    }
  }

  private async rename(route: Route, headers: Record<string, string>): Promise<void> {
    const {displayName} = route.request().postDataJSON() as {displayName: string};
    const cleaned = cleanedDisplayName(displayName);

    if (cleaned === undefined) {
      await route.fulfill({status: 400, headers, json: {}});
      return;
    }

    this.displayName = cleaned;
    await route.fulfill({status: 200, headers, json: {displayName: cleaned}});
  }

  private async store(route: Route, headers: Record<string, string>): Promise<void> {
    const request = route.request();
    const held = this.stored?.version ?? 0;

    if (request.headers()["if-match"] !== String(held)) {
      await route.fulfill({status: 409, headers, json: {version: held}});
      return;
    }

    const {blob} = request.postDataJSON() as {blob: string};

    this.stored = {version: held + 1, blob};
    await route.fulfill({status: 200, headers, json: {version: held + 1}});
  }
}
