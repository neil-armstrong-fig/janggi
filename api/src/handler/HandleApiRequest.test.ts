import {ApiHarness} from "@src/handler/testing/ApiHarness";
import {SITE} from "@src/handler/testing/SiteOrigin";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("the API answers a preflight for the site, allowing what the app sends", async () => {
  const response = await api.send("OPTIONS", "/api/data");

  expect(response.status).toBe(204);
  expect(response.headers.get("Access-Control-Allow-Origin")).toBe(SITE);
  expect(response.headers.get("Access-Control-Allow-Credentials")).toBe("true");
  expect(response.headers.get("Access-Control-Allow-Methods")).toContain("PATCH");
  expect(response.headers.get("Access-Control-Allow-Headers")).toContain("If-Match");
});

it("the API lets the browser remember a preflight, so it is not asked again for every write", async () => {
  expect((await api.send("OPTIONS", "/api/data")).headers.get("Access-Control-Max-Age")).toBe("7200");
});

it("the API lets the site read its answers, with credentials", async () => {
  const response = await api.send("GET", "/api/me");

  expect(response.headers.get("Access-Control-Allow-Origin")).toBe(SITE);
  expect(response.headers.get("Access-Control-Allow-Credentials")).toBe("true");
});

it("the API lets no other site read an answer", async () => {
  const response = await api.send("GET", "/api/me", {origin: "https://evil.example"});

  expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
});

const CHANGES = [
  ["POST", "/api/auth/logout"],
  ["PUT", "/api/data"],
  ["PATCH", "/api/me"],
  ["DELETE", "/api/account"],
] as const;

it.each(CHANGES)("the API refuses a %s %s from another site", async (method, path) => {
  const cookie = await api.signIn("google-1");

  expect((await api.send(method, path, {origin: "https://evil.example", cookie})).status).toBe(403);
});

it.each(CHANGES)("the API refuses a %s %s with no origin at all", async (method, path) => {
  const cookie = await api.signIn("google-1");

  expect((await api.send(method, path, {origin: null, cookie})).status).toBe(403);
});

it("the API does not act on a refused change", async () => {
  const cookie = await api.signIn("google-1");

  await api.send("DELETE", "/api/account", {origin: "https://evil.example", cookie});

  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(200);
});

it("the API has nothing at a path it does not serve", async () => {
  expect((await api.send("GET", "/api/nothing")).status).toBe(404);
});

it("the API has nothing for a method a path does not serve", async () => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("DELETE", "/api/me", {cookie})).status).toBe(404);
});

it("the API answers 401 to a request for a player's own page that carries no session", async () => {
  for (const [method, path] of [
    ["GET", "/api/me"],
    ["GET", "/api/data"],
  ] as const) {
    expect((await api.send(method, path)).status).toBe(401);
  }
});
