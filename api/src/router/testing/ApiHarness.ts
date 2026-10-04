import {testDatabase} from "@src/database/testing/TestDatabase";
import {testGoogle} from "@src/router/http/routes/sign-in/google/testing/TestGoogle";
import {testLimits} from "@src/router/http/routes/rate-limit/testing/TestLimits";
import {vi} from "vitest";
import {API} from "@src/router/testing/ApiOrigin";
import {SITE} from "@src/router/testing/SiteOrigin";
import {cookieOf} from "@src/router/testing/CookieOf";
import type {SendOptions} from "@src/router/testing/SendOptions";
import {routeRequest} from "@src/router/RouteRequest";
import {hashSessionToken} from "@src/router/shared/session/HashSessionToken";

/**
 * The API as a test meets it: the real router over the in-memory database, Google and limits `SetupApiTests` puts in place of the
 * functions that reach out, and a clock it can move. A class because it holds the one thing a test varies — which of those it
 * is talking to. `send` is a request from the site unless it says otherwise.
 */
export class ApiHarness {
  readonly database = testDatabase;
  readonly google = testGoogle;
  readonly limits = testLimits;

  /** Now, for the API: it reads the time from `Date`, which time standing still has replaced. */
  get clock(): Date {
    return new Date();
  }

  set clock(now: Date) {
    vi.setSystemTime(now);
  }

  send(method: string, path: string, options: SendOptions = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    const origin = originOf(options);

    if (origin !== null && origin !== undefined) headers.set("Origin", origin);
    if (options.cookie !== undefined) headers.set("Cookie", options.cookie);
    if (options.body !== undefined || options.rawBody !== undefined) headers.set("Content-Type", "application/json");

    const body = options.rawBody ?? bodyOf(options);

    return routeRequest(new Request(`${API}${path}`, {method, headers, body}));
  }

  /** The id of the account a session cookie belongs to, for a test that has to name it. */
  async accountIdOf(cookie: string): Promise<string> {
    const idHash = await hashSessionToken(cookie.slice("session=".length));

    return (await this.database.accountOfSession(idHash, this.clock))?.id ?? "";
  }

  /** Signs in as the Google subject `subject`, the whole way round, and gives back the session cookie it was handed. */
  async signIn(subject: string): Promise<string> {
    const started = await this.send("GET", `/api/auth/google?return=${SITE}/`, {origin: null});
    const attempt = cookieOf(started, "oauth");
    const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state") ?? "";

    this.google.subjectsByCode.set(`code-for-${subject}`, subject);

    const finished = await this.send("GET", `/api/auth/google/callback?code=code-for-${subject}&state=${state}`, {
      origin: null,
      cookie: attempt,
    });

    return cookieOf(finished, "session");
  }
}

/** Where a test's request comes from: the site, unless it says another origin or none (`origin: null`). */
function originOf(options: SendOptions): string | null | undefined {
  if ("origin" in options) return options.origin;

  return SITE;
}

/** The JSON of a test's `body`, where it has one. */
function bodyOf(options: SendOptions): string | undefined {
  if (options.body === undefined) return undefined;

  return JSON.stringify(options.body);
}
