import {ApiHarness} from "@src/router/testing/ApiHarness";

let api: ApiHarness;

beforeEach(() => {
  api = new ApiHarness();
});

it("a session tells whoever holds it who they are", async () => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(200);
});

it("a session is refused once it has run out", async () => {
  const cookie = await api.signIn("google-1");
  api.clock = new Date("2026-12-01T12:00:00Z");

  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(401);
});

it("a session lasts thirty days", async () => {
  const cookie = await api.signIn("google-1");

  api.clock = new Date("2026-10-30T12:00:00Z");
  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(200);

  api.clock = new Date("2026-10-31T12:00:01Z");
  expect((await api.send("GET", "/api/me", {cookie})).status).toBe(401);
});

it("a session is refused if it is not one the API made", async () => {
  expect((await api.send("GET", "/api/me", {cookie: "session=forged"})).status).toBe(401);
});
