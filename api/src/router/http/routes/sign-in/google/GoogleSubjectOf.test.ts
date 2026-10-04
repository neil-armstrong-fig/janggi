import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {googleSubjectOf} from "@src/router/http/routes/sign-in/google/GoogleSubjectOf";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

// The real function, not the Google every other test has (`SetupApiTests`).
vi.unmock("@src/router/http/routes/sign-in/google/GoogleSubjectOf");

const CLIENT_ID = "client-id.apps.googleusercontent.com";
const REDIRECT_URI = "https://janggi-api.neilarmstrong.dev/api/auth/google/callback";

beforeEach(() => {
  workerEnvironment.GOOGLE_CLIENT_ID = CLIENT_ID;
  workerEnvironment.GOOGLE_CLIENT_SECRET = "client-secret";
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_CLIENT_ID");
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_CLIENT_SECRET");
  vi.unstubAllGlobals();
});

interface TokenRequest {
  readonly url: string;
  readonly method: string;
  readonly form: URLSearchParams;
}

/** A JWT as Google's token endpoint hands one out. Its signature is not checked, so it is not made. */
function idToken(claims: Record<string, unknown>): string {
  const encode = (part: unknown): string =>
    btoa(JSON.stringify(part)).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
  const now = Math.floor(Date.now() / 1000);

  return [
    encode({alg: "RS256", typ: "JWT"}),
    encode({
      iss: "https://accounts.google.com",
      aud: CLIENT_ID,
      sub: "google-sub-123",
      iat: now,
      exp: now + 3600,
      ...claims,
    }),
    "signature",
  ].join(".");
}

/** The address a call to `fetch` was for, whether it was given a request or an address. */
function urlOf(input: RequestInfo | URL): string {
  if (input instanceof Request) return input.url;

  return String(input);
}

/** The token endpoint as the function meets it: answers with `body`, and remembers what it was asked. */
function googleAnswering(body: unknown, status = 200): {requests: TokenRequest[]} {
  const requests: TokenRequest[] = [];
  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    requests.push({
      url: urlOf(input),
      method: init?.method ?? "GET",
      form: new URLSearchParams(String(init?.body ?? "")),
    });

    return Response.json(body, {status});
  });

  return {requests};
}

const tokens = (token: string): Record<string, unknown> => ({
  access_token: "access",
  token_type: "Bearer",
  expires_in: 3600,
  id_token: token,
});
const callback = {
  code: "the-code",
  state: "the-state",
  codeVerifier: "a-verifier-of-the-right-length-0123456789abcdefghij",
  redirectUri: REDIRECT_URI,
};

it("exchanges the code at Google's token endpoint, with the verifier and the client's secret, and gives back who the player is", async () => {
  const google = googleAnswering(tokens(idToken({})));

  const subject = await googleSubjectOf(callback);

  expect(subject).toBe("google-sub-123");
  expect(google.requests).toHaveLength(1);
  expect(google.requests[0]?.url).toBe("https://oauth2.googleapis.com/token");
  expect(google.requests[0]?.method).toBe("POST");
  expect(Object.fromEntries(google.requests[0]?.form ?? [])).toMatchObject({
    grant_type: "authorization_code",
    code: "the-code",
    redirect_uri: REDIRECT_URI,
    code_verifier: callback.codeVerifier,
    client_id: CLIENT_ID,
    client_secret: "client-secret",
  });
});

it("refuses a code Google will not exchange", async () => {
  googleAnswering({error: "invalid_grant"}, 400);

  await expect(googleSubjectOf(callback)).rejects.toThrow();
});

it("refuses an ID token issued by anybody but Google", async () => {
  googleAnswering(tokens(idToken({iss: "https://evil.example"})));

  await expect(googleSubjectOf(callback)).rejects.toThrow();
});

it("refuses an ID token issued to another client", async () => {
  googleAnswering(tokens(idToken({aud: "someone-elses-client"})));

  await expect(googleSubjectOf(callback)).rejects.toThrow();
});

it("refuses an ID token that has expired", async () => {
  googleAnswering(tokens(idToken({iat: 1000, exp: 2000})));

  await expect(googleSubjectOf(callback)).rejects.toThrow();
});

it("refuses an answer with no ID token, since nothing then says who the player is", async () => {
  googleAnswering({access_token: "access", token_type: "Bearer", expires_in: 3600});

  await expect(googleSubjectOf(callback)).rejects.toThrow("did not say who the player is");
});

it("calls the platform's fetch as a plain function, never as a method of anything, which the Workers runtime refuses", async () => {
  let receiver: unknown = "not called";
  vi.stubGlobal("fetch", async function (this: unknown): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- the receiver is exactly what this test is about
    receiver = this;

    return Response.json(tokens(idToken({})));
  });

  await googleSubjectOf(callback);

  expect(receiver).toBeUndefined();
});
