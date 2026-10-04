import {ApiHarness} from "@src/router/testing/ApiHarness";
import {jsonOf} from "@src/router/testing/JsonOf";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("reading the player's data gives none, at version 0, to a player who has written nothing", async () => {
  const cookie = await api.signIn("google-1");

  expect(await jsonOf(await api.send("GET", "/api/data", {cookie}))).toEqual({version: 0, blob: null});
});

it("reading the player's data gives each player their own", async () => {
  const mine = await api.signIn("google-1");
  const theirs = await api.signIn("google-2");
  await api.send("PUT", "/api/data", {cookie: mine, headers: {"If-Match": "0"}, body: {blob: "mine"}});

  expect(await jsonOf(await api.send("GET", "/api/data", {cookie: theirs}))).toEqual({version: 0, blob: null});
});
