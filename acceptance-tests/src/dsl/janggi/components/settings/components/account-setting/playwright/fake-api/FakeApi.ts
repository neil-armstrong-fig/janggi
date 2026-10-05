import type {ApiRequest} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/ApiRequest";
import type {GooglePlayer} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/GooglePlayer";
import type {PushSubscriptionRequest} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/PushSubscriptionRequest";
import type {RoomRequest} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/RoomRequest";
import type {SignedInRequest} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/SignedInRequest";
import type {StoredAccount} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/StoredAccount";
import {DEFAULT_ROOM_AWAY_DAYS, ROOM_AWAY_DAYS} from "@janggi/shared/janggi/online/RoomAway";
import type {RoomAsked} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/fake-rooms/types/RoomAsked";
import {FakeRooms} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/fake-rooms/FakeRooms";
import type {Route, WebSocketRoute} from "@playwright/test";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";

/** The name a new account is given, as the real server gives one of its own making. */
const FIRST_NAMES: Record<GooglePlayer, string> = {
  "the usual player": "Kim Yu-sin",
  "another player": "Yi Sun-sin",
};

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
  /** Which account each device holds a Google session for. Devices share one server, and each signs in alone. */
  private readonly sessions = new Map<object, GooglePlayer>();
  /** Who a device's next sign-in is as; nobody named means the usual player. */
  private readonly signingInAs = new Map<object, GooglePlayer>();
  /** Whom each device last signed in as, which outlasts the session: what the server holds for them is theirs still after they sign out. */
  private readonly lastPlayers = new Map<object, GooglePlayer>();
  private readonly accounts = new Map<GooglePlayer, StoredAccount>();
  private readonly rooms = new FakeRooms();
  private down = false;
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
    this.sessions.delete(device);
    this.signingInAs.delete(device);
  }

  /** Makes a device's next sign-in a different Google account's than the usual one. */
  signInNextAs(device: object, player: GooglePlayer): void {
    this.signingInAs.set(device, player);
  }

  /** Seats a device at the room its socket is for, if the account it is signed in as may sit there. */
  acceptSocket(socket: WebSocketRoute, device: object): void {
    const code = parseFriendCode(new URL(socket.url()).pathname.split("/")[3] ?? "");

    if (this.down || code === undefined || !this.sessions.has(device)) {
      void socket.close({code: 1008, reason: "refused"});
      return;
    }

    this.rooms.connect(socket, code, device);
  }

  /** Drops the sockets a device holds to its rooms and refuses new ones, as a phone in a tunnel would. */
  dropRoomSockets(device: object): void {
    this.rooms.disconnect(device);
  }

  /** Every room a host has asked for. */
  getRoomsAsked(): readonly RoomAsked[] {
    return this.rooms.asked;
  }

  /** How many devices the account a device last signed in as has asked to be told of its turns on. */
  getPushEndpointCount(device: object): number {
    const player = this.lastPlayers.get(device);
    if (player === undefined) return 0;

    return this.accountOf(player).pushEndpoints.size;
  }

  /** Lets go of every room, as the real one does once both players have been away long enough. */
  letGoOfRooms(): void {
    this.rooms.letGoOfAll();
  }

  restoreRoomSockets(device: object): void {
    this.rooms.reconnect(device);
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
      const player = this.signingInAs.get(device) ?? "the usual player";
      const account = this.accountOf(player);

      this.sessions.set(device, player);
      this.lastPlayers.set(device, player);
      account.displayName ??= FIRST_NAMES[player];
      await route.fulfill({status: 302, headers: {Location: this.returnAddress(url, siteOrigin)}});
      return;
    }

    const player = this.sessions.get(device);

    if (player === undefined) {
      await route.fulfill({status: 401, headers: cors});
      return;
    }

    await this.answerSignedIn({route, path: url.pathname, headers: cors, device, account: this.accountOf(player)});
  }

  /** Where the real server sends the player back to: the address the app asked for, if it is on the site, and else the site. */
  private returnAddress(url: URL, siteOrigin: string): string {
    const asked = url.searchParams.get("return");

    try {
      if (asked !== null && new URL(asked).origin === siteOrigin) {
        return asked;
      }

      return `${siteOrigin}/`;
    } catch {
      return `${siteOrigin}/`;
    }
  }

  private accountOf(player: GooglePlayer): StoredAccount {
    const kept = this.accounts.get(player) ?? {displayName: undefined, data: undefined, pushEndpoints: new Set()};
    this.accounts.set(player, kept);

    return kept;
  }

  private async answerSignedIn({route, path, headers, device, account}: SignedInRequest): Promise<void> {
    const request = route.request();
    const method = request.method();

    if (method === "GET" && path === "/api/me") {
      await route.fulfill({status: 200, headers, json: {displayName: account.displayName}});
    } else if (method === "PATCH" && path === "/api/me") {
      await this.rename(route, headers, account);
    } else if (method === "GET" && path === "/api/data") {
      await route.fulfill({
        status: 200,
        headers,
        json: {version: account.data?.version ?? 0, blob: account.data?.blob ?? null},
      });
    } else if (path === "/api/push-subscription" && (method === "PUT" || method === "DELETE")) {
      await this.keepPushSubscription({route, headers, account});
    } else if (method === "POST" && path === "/api/rooms") {
      await this.createRoom({route, headers, host: account});
    } else if (method === "PUT" && path === "/api/data") {
      await this.store(route, headers, account);
    } else if (method === "POST" && path === "/api/auth/logout") {
      this.sessions.delete(device);
      await route.fulfill({status: 204, headers});
    } else if (method === "DELETE" && path === "/api/account") {
      this.sessions.delete(device);
      account.data = undefined;
      account.displayName = undefined;
      account.pushEndpoints.clear();
      await route.fulfill({status: 204, headers});
    } else {
      await route.fulfill({status: 404, headers});
    }
  }

  private async keepPushSubscription({route, headers, account}: PushSubscriptionRequest): Promise<void> {
    const request = route.request();
    const {endpoint} = request.postDataJSON() as {endpoint: string};

    if (request.method() === "PUT") {
      account.pushEndpoints.add(endpoint);
    } else {
      account.pushEndpoints.delete(endpoint);
    }

    await route.fulfill({status: 204, headers});
  }

  private async createRoom({route, headers, host}: RoomRequest): Promise<void> {
    const body = route.request().postDataJSON() as {side: Side; awayDays?: unknown};
    const side = body.side;
    const awayDays =
      body.awayDays === undefined ? DEFAULT_ROOM_AWAY_DAYS : ROOM_AWAY_DAYS.find(each => each === body.awayDays);

    if (!SIDES.includes(side) || awayDays === undefined) {
      await route.fulfill({status: 400, headers, json: {}});
      return;
    }

    const opened = this.rooms.create({asked: {side, awayDays}, host});

    if (opened.kind === "already-open") {
      await route.fulfill({status: 409, headers, json: {code: opened.code}});
      return;
    }

    await route.fulfill({status: 201, headers, json: {code: opened.code}});
  }

  private async rename(route: Route, headers: Record<string, string>, account: StoredAccount): Promise<void> {
    const {displayName} = route.request().postDataJSON() as {displayName: string};
    const cleaned = cleanedDisplayName(displayName);

    if (cleaned === undefined) {
      await route.fulfill({status: 400, headers, json: {}});
      return;
    }

    account.displayName = cleaned;
    await route.fulfill({status: 200, headers, json: {displayName: cleaned}});
  }

  private async store(route: Route, headers: Record<string, string>, account: StoredAccount): Promise<void> {
    const request = route.request();
    const held = account.data?.version ?? 0;

    if (request.headers()["if-match"] !== String(held)) {
      await route.fulfill({status: 409, headers, json: {version: held}});
      return;
    }

    const {blob} = request.postDataJSON() as {blob: string};

    account.data = {version: held + 1, blob};
    await route.fulfill({status: 200, headers, json: {version: held + 1}});
  }
}
