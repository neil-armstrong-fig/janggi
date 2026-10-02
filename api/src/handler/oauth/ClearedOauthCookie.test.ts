import {clearedOauthCookie} from "@src/handler/oauth/ClearedOauthCookie";

it("ends an attempt with an empty cookie of the same name and path, with no time left", () => {
  const cleared = clearedOauthCookie();

  expect(cleared).toContain("oauth=;");
  expect(cleared).toContain("Path=/api/auth/google");
  expect(cleared).toContain("Max-Age=0");
});
