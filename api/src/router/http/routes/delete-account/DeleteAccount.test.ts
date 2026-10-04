import {ApiHarness} from "@src/router/testing/ApiHarness";
import {jsonOf} from "@src/router/testing/JsonOf";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("deleting the account deletes the account, its sessions and its data, and clears the cookie", async () => {
  const cookie = await api.signIn("google-1");
  await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body: {blob: "mine"}});

  const response = await api.send("DELETE", "/api/account", {cookie});

  expect(response.status).toBe(204);
  expect(response.headers.getSetCookie().some(set => set.startsWith("session=;"))).toBe(true);
  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(401);
});

it("deleting the account leaves every other account alone", async () => {
  const mine = await api.signIn("google-1");
  const theirs = await api.signIn("google-2");
  await api.send("PUT", "/api/data", {cookie: theirs, headers: {"If-Match": "0"}, body: {blob: "theirs"}});

  await api.send("DELETE", "/api/account", {cookie: mine});

  expect(await jsonOf(await api.send("GET", "/api/data", {cookie: theirs}))).toEqual({version: 1, blob: "theirs"});
});

it("deleting the account gives a player who signs in again a new account, with nothing of the old one", async () => {
  const old = await api.signIn("google-1");
  await api.send("PUT", "/api/data", {cookie: old, headers: {"If-Match": "0"}, body: {blob: "mine"}});
  await api.send("DELETE", "/api/account", {cookie: old});

  const fresh = await api.signIn("google-1");

  expect(await jsonOf(await api.send("GET", "/api/data", {cookie: fresh}))).toEqual({version: 0, blob: null});
});
