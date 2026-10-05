import {ApiHarness} from "@src/router/testing/ApiHarness";

let api: ApiHarness;

const SUBSCRIPTION = {endpoint: "https://push.example/phone", keys: {p256dh: "BKey_1-a", auth: "auth_1-a"}};

beforeEach(() => {
  api = new ApiHarness();
});

it("subscribing keeps the device for the account", async () => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("PUT", "/api/push-subscription", {cookie, body: SUBSCRIPTION});

  expect(response.status).toBe(204);
  expect(await api.database.pushSubscriptionsOf(await api.accountIdOf(cookie))).toEqual([
    {endpoint: SUBSCRIPTION.endpoint, p256dh: "BKey_1-a", auth: "auth_1-a"},
  ]);
});

it("subscribing is refused without a session", async () => {
  expect((await api.send("PUT", "/api/push-subscription", {body: SUBSCRIPTION})).status).toBe(401);
});

it("subscribing is refused when the account has written too much lately", async () => {
  const cookie = await api.signIn("google-1");
  api.limits.refuse("data", await api.accountIdOf(cookie));

  expect((await api.send("PUT", "/api/push-subscription", {cookie, body: SUBSCRIPTION})).status).toBe(429);
});

it.each([
  ["not an object", "nope"],
  ["no endpoint", {keys: SUBSCRIPTION.keys}],
  ["an endpoint that is not https", {...SUBSCRIPTION, endpoint: "http://push.example/phone"}],
  ["an endpoint that is not an address", {...SUBSCRIPTION, endpoint: "not a url"}],
  ["an endpoint that is far too long", {...SUBSCRIPTION, endpoint: `https://push.example/${"a".repeat(2000)}`}],
  ["no keys", {endpoint: SUBSCRIPTION.endpoint}],
  ["a key that is not base64url", {...SUBSCRIPTION, keys: {...SUBSCRIPTION.keys, p256dh: "not base64!"}}],
  ["a missing auth", {...SUBSCRIPTION, keys: {p256dh: "BKey"}}],
])("subscribing refuses a body with %s, and keeps nothing", async (_why, body) => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("PUT", "/api/push-subscription", {cookie, body})).status).toBe(400);
  expect(await api.database.pushSubscriptionsOf(await api.accountIdOf(cookie))).toEqual([]);
});

it("unsubscribing lets the device go", async () => {
  const cookie = await api.signIn("google-1");
  await api.send("PUT", "/api/push-subscription", {cookie, body: SUBSCRIPTION});

  const response = await api.send("DELETE", "/api/push-subscription", {
    cookie,
    body: {endpoint: SUBSCRIPTION.endpoint},
  });

  expect(response.status).toBe(204);
  expect(await api.database.pushSubscriptionsOf(await api.accountIdOf(cookie))).toEqual([]);
});

it("unsubscribing leaves a device that is another account's", async () => {
  const mine = await api.signIn("google-1");
  const theirs = await api.signIn("google-2");
  await api.send("PUT", "/api/push-subscription", {cookie: theirs, body: SUBSCRIPTION});

  await api.send("DELETE", "/api/push-subscription", {cookie: mine, body: {endpoint: SUBSCRIPTION.endpoint}});

  expect(await api.database.pushSubscriptionsOf(await api.accountIdOf(theirs))).toHaveLength(1);
});

it("unsubscribing refuses a body with no endpoint", async () => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("DELETE", "/api/push-subscription", {cookie, body: {}})).status).toBe(400);
});

it("deleting the account takes its devices with it", async () => {
  const cookie = await api.signIn("google-1");
  const id = await api.accountIdOf(cookie);
  await api.send("PUT", "/api/push-subscription", {cookie, body: SUBSCRIPTION});

  await api.send("DELETE", "/api/account", {cookie});

  expect(await api.database.pushSubscriptionsOf(id)).toEqual([]);
});
