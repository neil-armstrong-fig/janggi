import {ApiHarness} from "@src/router/testing/ApiHarness";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("signing out ends the session, and the cookie with it", async () => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("POST", "/api/auth/logout", {cookie});

  expect(response.status).toBe(204);
  expect(response.headers.getSetCookie().some(set => set.startsWith("session=;"))).toBe(true);
  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(401);
});

it("signing out succeeds where there is no session to end", async () => {
  expect((await api.send("POST", "/api/auth/logout")).status).toBe(204);
});
