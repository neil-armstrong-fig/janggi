import {ApiHarness} from "@src/router/testing/ApiHarness";
import {jsonOf} from "@src/router/testing/JsonOf";
import {MAX_REQUEST_LENGTH} from "@src/router/http/routes/write-data/request-length/MaxRequestLength";
import {MAX_SYNCED_DATA_LENGTH} from "@janggi/shared/janggi/account/SyncedDataLimit";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("writing the player's data keeps a document written against the version read, and reads it back", async () => {
  const cookie = await api.signIn("google-1");

  const written = await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body: {blob: "document"}});

  expect(written.status).toBe(200);
  expect(await jsonOf(written)).toEqual({version: 1});
  expect(await jsonOf(await api.send("GET", "/api/data", {cookie}))).toEqual({version: 1, blob: "document"});
});

it("writing the player's data refuses a document, with the version to read again from, where another device has written since", async () => {
  const cookie = await api.signIn("google-1");
  await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body: {blob: "first"}});

  const response = await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body: {blob: "stale"}});

  expect(response.status).toBe(409);
  expect(await jsonOf(response)).toEqual({version: 1});
  expect(await jsonOf(await api.send("GET", "/api/data", {cookie}))).toEqual({version: 1, blob: "first"});
});

it.each([
  ["missing", undefined],
  ["not a number", "latest"],
  ["negative", "-1"],
  ["a fraction", "1.5"],
])("writing the player's data refuses a document written against a version that is %s", async (_why, ifMatch) => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("PUT", "/api/data", {
    cookie,
    headers: ifMatchHeader(ifMatch),
    body: {blob: "x"},
  });

  expect(response.status).toBe(428);
});

it("writing the player's data refuses a request declared larger than allowed, before it is read", async () => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("PUT", "/api/data", {
    cookie,
    headers: {"If-Match": "0", "Content-Length": String(MAX_REQUEST_LENGTH + 1)},
    body: {blob: "x"},
  });

  expect(response.status).toBe(413);
});

it("writing the player's data refuses a request that turns out larger than allowed, whatever it declared", async () => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("PUT", "/api/data", {
    cookie,
    headers: {"If-Match": "0"},
    body: {blob: "x".repeat(MAX_REQUEST_LENGTH)},
  });

  expect(response.status).toBe(413);
});

it("writing the player's data refuses a document a character over the most it may hold", async () => {
  const cookie = await api.signIn("google-1");
  const blob = "x".repeat(MAX_SYNCED_DATA_LENGTH + 1);

  expect((await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body: {blob}})).status).toBe(413);
});

it("writing the player's data keeps a document of exactly the most it may hold", async () => {
  const cookie = await api.signIn("google-1");
  const blob = "x".repeat(MAX_SYNCED_DATA_LENGTH);

  expect((await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body: {blob}})).status).toBe(200);
});

it("writing the player's data keeps a document whose escaping makes the request longer than the document may be", async () => {
  const cookie = await api.signIn("google-1");
  const blob = '"'.repeat(MAX_SYNCED_DATA_LENGTH);

  expect((await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body: {blob}})).status).toBe(200);
});

it.each([
  ["not an object", [1]],
  ["without a document", {}],
  ["with a document that is not text", {blob: {a: 1}}],
])("writing the player's data refuses a body that is %s", async (_why, body) => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body})).status).toBe(400);
});

it("writing the player's data refuses a body that is not JSON", async () => {
  const cookie = await api.signIn("google-1");
  const response = await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, rawBody: "{nope"});

  expect(response.status).toBe(400);
});

it("writing the player's data refuses a player who has used up their allowance of writes", async () => {
  const cookie = await api.signIn("google-1");
  api.limits.refuse("data", await api.accountIdOf(cookie));

  expect((await api.send("PUT", "/api/data", {cookie, headers: {"If-Match": "0"}, body: {blob: "x"}})).status).toBe(
    429,
  );
});

/** The `If-Match` header a write carries, or none where the test sends none. */
function ifMatchHeader(ifMatch: string | undefined): Record<string, string> {
  if (ifMatch === undefined) return {};

  return {"If-Match": ifMatch};
}
