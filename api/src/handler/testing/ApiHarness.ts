import {API} from "@src/handler/testing/ApiOrigin";
import {SITE} from "@src/handler/testing/SiteOrigin";
import {cookieOf} from "@src/handler/testing/CookieOf";
import type {SendOptions} from "@src/handler/testing/SendOptions";
import type {GoogleCallback} from "@src/google/types/GoogleCallback";
import type {GoogleSignIn} from "@src/google/GoogleSignIn";
import {InMemoryAccountStore} from "@src/database/testing/InMemoryAccountStore";
import type {RateLimiter} from "@src/handler/services/RateLimiter";
import type {RouteServices} from "@src/handler/services/RouteServices";
import {handleApiRequest} from "@src/handler/HandleApiRequest";
import {hashSessionToken} from "@src/handler/session/HashSessionToken";

/** A Google that says each code is the consent of whichever subject the test asked it to know, and refuses the rest. */
class FakeGoogle implements GoogleSignIn {
  readonly subjectsByCode = new Map<string, string>();

  authorizationUrl(state: string): Promise<URL> {
    return Promise.resolve(new URL(`https://accounts.google.test/consent?state=${state}`));
  }

  subjectOf({code}: GoogleCallback): Promise<string> {
    const subject = this.subjectsByCode.get(code);

    return subject === undefined ? Promise.reject(new Error("Google refused the code")) : Promise.resolve(subject);
  }
}

/** A limiter that allows everything until a test says to refuse one key. */
class FakeLimiter implements RateLimiter {
  readonly refused = new Set<string>();

  allow(key: string): Promise<boolean> {
    return Promise.resolve(!this.refused.has(key));
  }
}

/**
 * The API as a test meets it: the real handler over an in-memory store, a Google the test controls, a clock it can
 * move, and limiters it can close. `send` is a request from the site unless it says otherwise.
 */
export class ApiHarness {
  readonly store = new InMemoryAccountStore();
  readonly google = new FakeGoogle();
  readonly loginLimiter = new FakeLimiter();
  readonly dataLimiter = new FakeLimiter();
  clock = new Date("2026-10-01T12:00:00Z");

  private readonly services: RouteServices = {
    store: this.store,
    google: this.google,
    allowedOrigins: [SITE, "http://localhost:3000"],
    loginLimiter: this.loginLimiter,
    dataLimiter: this.dataLimiter,
    now: () => this.clock,
    random: () => 0,
  };

  send(method: string, path: string, options: SendOptions = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    const origin = "origin" in options ? options.origin : SITE;

    if (origin !== null && origin !== undefined) headers.set("Origin", origin);
    if (options.cookie !== undefined) headers.set("Cookie", options.cookie);
    if (options.body !== undefined || options.rawBody !== undefined) headers.set("Content-Type", "application/json");

    const body = options.rawBody ?? (options.body === undefined ? undefined : JSON.stringify(options.body));

    return handleApiRequest(new Request(`${API}${path}`, {method, headers, body}), this.services);
  }

  /** The id of the account a session cookie belongs to, for a test that has to name it. */
  async accountIdOf(cookie: string): Promise<string> {
    const idHash = await hashSessionToken(cookie.slice("session=".length));

    return (await this.store.accountOfSession(idHash, this.clock))?.id ?? "";
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
