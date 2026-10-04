import {API} from "@src/router/testing/ApiOrigin";
import {afterEach, vi} from "vitest";
import {ApiHarness} from "@src/router/testing/ApiHarness";
import {SITE} from "@src/router/testing/SiteOrigin";
import {cookieOf} from "@src/router/testing/CookieOf";
import {jsonOf} from "@src/router/testing/JsonOf";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("finishing a sign-in brings the player back to where the app asked, with a session", async () => {
  const started = await api.send("GET", `/api/auth/google?return=${SITE}/?a=1`, {origin: null});
  const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state");
  api.google.subjectsByCode.set("good", "google-1");

  const finished = await api.send("GET", `/api/auth/google/callback?code=good&state=${state}`, {
    origin: null,
    cookie: cookieOf(started, "oauth"),
  });

  expect(finished.status).toBe(302);
  expect(finished.headers.get("Location")).toBe(`${SITE}/?a=1`);
  expect(cookieOf(finished, "session")).not.toBe("");
});

it("finishing a sign-in will not send the player on to a site that is not allowed", async () => {
  const started = await api.send("GET", "/api/auth/google?return=https://evil.example/", {origin: null});
  const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state");
  api.google.subjectsByCode.set("good", "google-1");

  const finished = await api.send("GET", `/api/auth/google/callback?code=good&state=${state}`, {
    origin: null,
    cookie: cookieOf(started, "oauth"),
  });

  expect(finished.headers.get("Location")).toBe(`${SITE}/`);
});

it("finishing a sign-in ends the attempt once it has been used", async () => {
  const started = await api.send("GET", "/api/auth/google", {origin: null});
  const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state");
  api.google.subjectsByCode.set("good", "google-1");

  const finished = await api.send("GET", `/api/auth/google/callback?code=good&state=${state}`, {
    origin: null,
    cookie: cookieOf(started, "oauth"),
  });

  expect(finished.headers.getSetCookie().some(cookie => cookie.startsWith("oauth=;"))).toBe(true);
});

it("finishing a sign-in sets a session cookie no script can read", async () => {
  const started = await api.send("GET", "/api/auth/google", {origin: null});
  const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state");
  api.google.subjectsByCode.set("good", "google-1");

  const finished = await api.send("GET", `/api/auth/google/callback?code=good&state=${state}`, {
    origin: null,
    cookie: cookieOf(started, "oauth"),
  });
  const session = finished.headers.getSetCookie().find(cookie => cookie.startsWith("session="));

  expect(session).toContain("HttpOnly");
  expect(session).toContain("Secure");
  expect(session).toContain("SameSite=Lax");
});

it("finishing a sign-in gives a new account the name of one of the generals", async () => {
  const cookie = await api.signIn("google-1");

  expect(await jsonOf(await api.send("GET", "/api/me", {cookie}))).toEqual({displayName: "Yi Sun-sin"});
});

it("finishing a sign-in gives the same account to the same Google subject on the next sign-in", async () => {
  const first = await api.signIn("google-1");
  await api.send("PATCH", "/api/me", {cookie: first, body: {displayName: "Admiral Yi"}});

  const second = await api.signIn("google-1");

  expect(await jsonOf(await api.send("GET", "/api/me", {cookie: second}))).toEqual({displayName: "Admiral Yi"});
});

it("finishing a sign-in will not finish an attempt whose state is not the one it started", async () => {
  const started = await api.send("GET", "/api/auth/google", {origin: null});
  api.google.subjectsByCode.set("good", "google-1");

  const finished = await api.send("GET", "/api/auth/google/callback?code=good&state=forged", {
    origin: null,
    cookie: cookieOf(started, "oauth"),
  });

  expect(cookieOf(finished, "session")).toBe("");
  expect(finished.status).toBe(302);
});

it("finishing a sign-in will not finish an attempt it never started", async () => {
  api.google.subjectsByCode.set("good", "google-1");

  const finished = await api.send("GET", "/api/auth/google/callback?code=good&state=anything", {origin: null});

  expect(finished.status).toBe(400);
  expect(cookieOf(finished, "session")).toBe("");
});

it("finishing a sign-in sends the player back with no session where Google refuses the code", async () => {
  const started = await api.send("GET", "/api/auth/google", {origin: null});
  const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state");

  const finished = await api.send("GET", `/api/auth/google/callback?code=forged&state=${state}`, {
    origin: null,
    cookie: cookieOf(started, "oauth"),
  });

  expect(finished.status).toBe(302);
  expect(cookieOf(finished, "session")).toBe("");
});

it("finishing a sign-in sends the player back with no session where the callback has no code", async () => {
  const started = await api.send("GET", "/api/auth/google", {origin: null});
  const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state");

  const finished = await api.send("GET", `/api/auth/google/callback?state=${state}`, {
    origin: null,
    cookie: cookieOf(started, "oauth"),
  });

  expect(cookieOf(finished, "session")).toBe("");
});

it("finishing a sign-in will not finish an attempt for a player who has used up their allowance", async () => {
  api.limits.refuse("login", "unknown");

  expect((await api.send("GET", "/api/auth/google/callback?code=x&state=y", {origin: null})).status).toBe(429);
});

describe("logging why a sign-in did not complete", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("says in the log why Google refused the code", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const started = await api.send("GET", "/api/auth/google", {origin: null});
    const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state");

    await api.send("GET", `/api/auth/google/callback?code=forged&state=${state}`, {
      origin: null,
      cookie: cookieOf(started, "oauth"),
    });

    expect(log).toHaveBeenCalledWith("Sign-in failed:", expect.any(Error));
  });

  it("says in the log that the callback carried no attempt cookie", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await api.send("GET", "/api/auth/google/callback?code=x&state=y", {origin: null});

    expect(log).toHaveBeenCalledWith(expect.stringContaining("no attempt cookie"));
  });

  it("says in the log that Google sent no code, and what it said instead", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const started = await api.send("GET", "/api/auth/google", {origin: null});

    await api.send("GET", "/api/auth/google/callback?error=access_denied", {
      origin: null,
      cookie: cookieOf(started, "oauth"),
    });

    expect(log).toHaveBeenCalledWith(expect.stringContaining("access_denied"));
  });
});

it("finishing a sign-in gives Google the code, the attempt's state and verifier, and the callback address it was sent to", async () => {
  const started = await api.send("GET", "/api/auth/google", {origin: null});
  const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state");
  api.google.subjectsByCode.set("good", "google-1");

  await api.send("GET", `/api/auth/google/callback?code=good&state=${state}`, {
    origin: null,
    cookie: cookieOf(started, "oauth"),
  });

  expect(api.google.exchanges).toEqual([
    {
      code: "good",
      state,
      codeVerifier: api.google.authorizations[0]?.codeVerifier,
      redirectUri: `${API}/api/auth/google/callback`,
    },
  ]);
});
