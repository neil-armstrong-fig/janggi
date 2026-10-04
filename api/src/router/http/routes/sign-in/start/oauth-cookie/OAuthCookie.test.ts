import {oauthCookie} from "@src/router/http/routes/sign-in/start/oauth-cookie/OAuthCookie";

const ATTEMPT = {state: "s", codeVerifier: "v", returnTo: "https://janggi.neilarmstrong.dev/"};

it("is kept to the callback's path, away from script, HTTPS only", () => {
  const cookie = oauthCookie(ATTEMPT);

  expect(cookie).toContain("Path=/api/auth/google");
  expect(cookie).toContain("HttpOnly");
  expect(cookie).toContain("Secure");
  expect(cookie).toContain("SameSite=Lax");
});

it("lasts ten minutes", () => {
  expect(oauthCookie(ATTEMPT)).toMatch(/Max-Age=600;/);
});
