import {ApiHarness} from "@src/router/testing/ApiHarness";
import {logApiEvent} from "@src/observability/LogApiEvent";
import {SITE} from "@src/router/testing/SiteOrigin";

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

it("logs a preflight exactly once without its URL", async () => {
  await api.send("OPTIONS", "/api/data?token=secret-token");

  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "preflight",
    transport: "http",
    outcome: "preflight",
    status: 204,
  });
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret-token");
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

  expect((await api.send(method, path, {withoutOrigin: true, cookie})).status).toBe(403);
});

it("the API does not act on a refused change", async () => {
  const cookie = await api.signIn("google-1");

  await api.send("DELETE", "/api/account", {origin: "https://evil.example", cookie});

  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(200);
});

it("the API has nothing at a path it does not serve", async () => {
  expect((await api.send("GET", "/api/nothing")).status).toBe(404);
});

it("logs an unknown HTTP route exactly once without its path", async () => {
  await api.send("GET", "/api/secret-path?token=secret-token");

  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "unknown",
    transport: "http",
    outcome: "unknown_route",
    status: 404,
  });
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret-path");
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret-token");
});

it("logs a forged change exactly once without its origin", async () => {
  await api.send("DELETE", "/api/account", {origin: "https://secret-origin.example"});

  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "DELETE /api/account",
    transport: "http",
    outcome: "forged_change",
    status: 403,
  });
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret-origin");
});

it("logs a routed success exactly once", async () => {
  await api.send("POST", "/api/auth/logout");

  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "POST /api/auth/logout",
    transport: "http",
    outcome: "succeeded",
    status: 204,
  });
});

it("logs a routed rejection exactly once", async () => {
  await api.send("GET", "/api/me");

  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "GET /api/me",
    transport: "http",
    outcome: "rejected",
    status: 401,
  });
});

it("the API says 404 to a route it does not serve even where the request is a forged change, and still lets the site read it", async () => {
  const response = await api.send("POST", "/api/nothing", {origin: "https://evil.example"});

  expect(response.status).toBe(404);
  expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
  expect((await api.send("POST", "/api/nothing")).headers.get("Access-Control-Allow-Origin")).toBe(SITE);
});

it("the API deletes an account only for DELETE /api/account, and for nothing that is merely near it", async () => {
  const cookie = await api.signIn("google-1");

  for (const [method, path] of [
    ["GET", "/api/account"],
    ["POST", "/api/account"],
    ["DELETE", "/api/account/"],
    ["DELETE", "/api/accounts"],
    ["DELETE", "/api/me"],
  ] as const) {
    expect((await api.send(method, path, {cookie})).status).toBe(404);
  }

  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(200);
  expect((await api.send("DELETE", "/api/account", {cookie})).status).toBe(204);
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
