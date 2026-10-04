import {SESSION_LIFETIME_SECONDS} from "@src/router/http/routes/sign-in/finish/session-cookie/SessionLifetime";
import {sessionCookie} from "@src/router/http/routes/sign-in/finish/session-cookie/SessionCookie";

it("starts a session in a cookie no script can read and only HTTPS carries", () => {
  const cookie = sessionCookie("token");

  expect(cookie).toContain("session=token");
  expect(cookie).toContain("HttpOnly");
  expect(cookie).toContain("Secure");
});

it("keeps the cookie to the site's own requests, with SameSite=Lax", () => {
  expect(sessionCookie("token")).toContain("SameSite=Lax");
});

it("lasts as long as the session does", () => {
  expect(sessionCookie("token")).toContain(`Max-Age=${SESSION_LIFETIME_SECONDS}`);
});
