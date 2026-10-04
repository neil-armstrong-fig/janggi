import {clearedSessionCookie} from "@src/router/http/routes/session-cookie/ClearedSessionCookie";

it("ends a session with a cookie of the same name, empty, and no time left", () => {
  const cookie = clearedSessionCookie();

  expect(cookie).toContain("session=;");
  expect(cookie).toContain("Max-Age=0");
  expect(cookie).toContain("Path=/");
});
