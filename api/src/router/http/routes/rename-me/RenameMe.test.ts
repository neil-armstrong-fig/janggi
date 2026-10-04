import {ApiHarness} from "@src/router/testing/ApiHarness";
import {jsonOf} from "@src/router/testing/JsonOf";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("changing the display name changes the name, and keeps it for the next time the player is asked", async () => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("PATCH", "/api/me", {cookie, body: {displayName: "Admiral Yi"}});

  expect(await jsonOf(response)).toEqual({displayName: "Admiral Yi"});
  expect(await jsonOf(await api.send("GET", "/api/me", {cookie}))).toEqual({displayName: "Admiral Yi"});
});

it("changing the display name keeps and answers the name as it is tidied", async () => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("PATCH", "/api/me", {cookie, body: {displayName: "  Admiral   Yi "}});

  expect(await jsonOf(response)).toEqual({displayName: "Admiral Yi"});
});

it.each([
  ["empty", ""],
  ["too long", "a".repeat(25)],
  ["a line break", "a\nb"],
  ["not a string", 7],
])("changing the display name refuses a name that is %s, and leaves it as it was", async (_why, displayName) => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("PATCH", "/api/me", {cookie, body: {displayName}})).status).toBe(400);
  expect(await jsonOf(await api.send("GET", "/api/me", {cookie}))).toEqual({displayName: "Yi Sun-sin"});
});

it("changing the display name refuses a body that is not the shape it should be", async () => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("PATCH", "/api/me", {cookie, body: {nope: 1}})).status).toBe(400);
  expect((await api.send("PATCH", "/api/me", {cookie, body: null})).status).toBe(400);
});
