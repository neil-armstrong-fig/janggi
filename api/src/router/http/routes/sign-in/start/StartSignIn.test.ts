import {API} from "@src/router/testing/ApiOrigin";
import {ApiHarness} from "@src/router/testing/ApiHarness";
import {cookieOf} from "@src/router/testing/CookieOf";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("starting a sign-in sends the player to Google, holding the attempt in a cookie", async () => {
  const response = await api.send("GET", "/api/auth/google", {origin: null});

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toContain("https://accounts.google.test/consent");
  expect(cookieOf(response, "oauth")).not.toBe("");
});

it("starting a sign-in sends the state it made to Google, and keeps the same one for the callback to check", async () => {
  const response = await api.send("GET", "/api/auth/google", {origin: null});
  const state = new URL(response.headers.get("Location") ?? "").searchParams.get("state");

  expect(state).toBeTruthy();
  expect(decodeURIComponent(atob(cookieOf(response, "oauth").slice("oauth=".length)))).toContain(`"state":"${state}"`);
});

it("starting a sign-in will not start an attempt for a player who has used up their allowance", async () => {
  api.limits.refuse("login", "unknown");

  expect((await api.send("GET", "/api/auth/google", {origin: null})).status).toBe(429);
});

it("starting a sign-in tells Google to send the player back to this API's own callback, on the host the request came to", async () => {
  await api.send("GET", "/api/auth/google", {origin: null});

  expect(api.google.authorizations).toHaveLength(1);
  expect(api.google.authorizations[0]?.redirectUri).toBe(`${API}/api/auth/google/callback`);
});
