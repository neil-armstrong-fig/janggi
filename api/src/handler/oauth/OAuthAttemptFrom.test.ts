import {oauthAttemptFrom} from "@src/handler/oauth/OAuthAttemptFrom";
import {oauthCookie} from "@src/handler/oauth/OAuthCookie";

const ATTEMPT = {state: "s", codeVerifier: "v", returnTo: "https://janggi.neilarmstrong.dev/?a=b"};
const headerOf = (cookie: string): string => cookie.split(";")[0] ?? "";

it("reads back the attempt that was written", () => {
  expect(oauthAttemptFrom(headerOf(oauthCookie(ATTEMPT)))).toEqual(ATTEMPT);
});

it("reads it among other cookies", () => {
  expect(oauthAttemptFrom(`session=abc; ${headerOf(oauthCookie(ATTEMPT))}; theme=dark`)).toEqual(ATTEMPT);
});

it("finds no attempt where there is no cookie, or nothing in it", () => {
  expect(oauthAttemptFrom(null)).toBeUndefined();
  expect(oauthAttemptFrom("oauth=")).toBeUndefined();
});

it("finds no attempt in a cookie that is not one it wrote", () => {
  expect(oauthAttemptFrom("oauth=!!!")).toBeUndefined();
  expect(oauthAttemptFrom(`oauth=${btoa("not json")}`)).toBeUndefined();
  expect(oauthAttemptFrom(`oauth=${btoa(JSON.stringify({state: "s"}))}`)).toBeUndefined();
  expect(oauthAttemptFrom(`oauth=${btoa("null")}`)).toBeUndefined();
});
