import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {googleAuthorizationUrl} from "@src/router/http/routes/sign-in/google/GoogleAuthorizationUrl";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

// The real function, not the Google every other test has (`SetupApiTests`).
vi.unmock("@src/router/http/routes/sign-in/google/GoogleAuthorizationUrl");

const CLIENT_ID = "client-id.apps.googleusercontent.com";
const REDIRECT_URI = "https://janggi-api.neilarmstrong.dev/api/auth/google/callback";
const VERIFIER = "a-verifier-of-the-right-length-0123456789abcdefghij";

beforeEach(() => {
  workerEnvironment.GOOGLE_CLIENT_ID = CLIENT_ID;
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_CLIENT_ID");
});

it("sends the player to Google's consent screen, asking for the code flow with openid and nothing more", async () => {
  const url = await googleAuthorizationUrl({state: "the-state", codeVerifier: VERIFIER, redirectUri: REDIRECT_URI});

  expect(`${url.origin}${url.pathname}`).toBe("https://accounts.google.com/o/oauth2/v2/auth");
  expect(url.searchParams.get("client_id")).toBe(CLIENT_ID);
  expect(url.searchParams.get("redirect_uri")).toBe(REDIRECT_URI);
  expect(url.searchParams.get("response_type")).toBe("code");
  expect(url.searchParams.get("scope")).toBe("openid");
  expect(url.searchParams.get("state")).toBe("the-state");
});

it("proves the verifier with a PKCE challenge, as RFC 7636 works one out", async () => {
  const url = await googleAuthorizationUrl({
    state: "s",
    codeVerifier: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
    redirectUri: REDIRECT_URI,
  });

  expect(url.searchParams.get("code_challenge")).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  expect(url.searchParams.get("code_challenge_method")).toBe("S256");
});
