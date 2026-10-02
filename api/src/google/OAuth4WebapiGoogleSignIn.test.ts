import {OAuth4WebapiGoogleSignIn} from "@src/google/OAuth4WebapiGoogleSignIn";

const CLIENT_ID = "client-id.apps.googleusercontent.com";
const REDIRECT_URI = "https://api.janggi.neilarmstrong.dev/api/auth/google/callback";

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

/** The token endpoint as the adapter meets it: answers with `body`, and remembers what it was asked. */
function googleAnswering(body: unknown, status = 200): {fetcher: typeof fetch; requests: TokenRequest[]} {
  const requests: TokenRequest[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    requests.push({
      url: String(input instanceof Request ? input.url : input),
      method: init?.method ?? "GET",
      form: new URLSearchParams(String(init?.body ?? "")),
    });

    return Response.json(body, {status});
  }) as typeof fetch;

  return {fetcher, requests};
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
};

function signIn(fetcher: typeof fetch = fetch): OAuth4WebapiGoogleSignIn {
  return new OAuth4WebapiGoogleSignIn(CLIENT_ID, "client-secret", REDIRECT_URI, fetcher);
}

it("sends the player to Google's consent screen, asking for the code flow with openid and nothing more", async () => {
  const url = await signIn().authorizationUrl("the-state", callback.codeVerifier);

  expect(`${url.origin}${url.pathname}`).toBe("https://accounts.google.com/o/oauth2/v2/auth");
  expect(url.searchParams.get("client_id")).toBe(CLIENT_ID);
  expect(url.searchParams.get("redirect_uri")).toBe(REDIRECT_URI);
  expect(url.searchParams.get("response_type")).toBe("code");
  expect(url.searchParams.get("scope")).toBe("openid");
  expect(url.searchParams.get("state")).toBe("the-state");
});

it("proves the verifier with a PKCE challenge, as RFC 7636 works one out", async () => {
  const url = await signIn().authorizationUrl("s", "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk");

  expect(url.searchParams.get("code_challenge")).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  expect(url.searchParams.get("code_challenge_method")).toBe("S256");
});

it("exchanges the code at Google's token endpoint, with the verifier and the client's secret, and gives back who the player is", async () => {
  const google = googleAnswering(tokens(idToken({})));

  const subject = await signIn(google.fetcher).subjectOf(callback);

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
  const google = googleAnswering({error: "invalid_grant"}, 400);

  await expect(signIn(google.fetcher).subjectOf(callback)).rejects.toThrow();
});

it("refuses an ID token issued by anybody but Google", async () => {
  const google = googleAnswering(tokens(idToken({iss: "https://evil.example"})));

  await expect(signIn(google.fetcher).subjectOf(callback)).rejects.toThrow();
});

it("refuses an ID token issued to another client", async () => {
  const google = googleAnswering(tokens(idToken({aud: "someone-elses-client"})));

  await expect(signIn(google.fetcher).subjectOf(callback)).rejects.toThrow();
});

it("refuses an ID token that has expired", async () => {
  const google = googleAnswering(tokens(idToken({iat: 1000, exp: 2000})));

  await expect(signIn(google.fetcher).subjectOf(callback)).rejects.toThrow();
});

it("refuses an answer with no ID token, since nothing then says who the player is", async () => {
  const google = googleAnswering({access_token: "access", token_type: "Bearer", expires_in: 3600});

  await expect(signIn(google.fetcher).subjectOf(callback)).rejects.toThrow("did not say who the player is");
});

it("calls the platform's fetch as a plain function, never as a method of the adapter, which the Workers runtime refuses", async () => {
  let receiver: unknown = "not called";
  const fetcher = async function (this: unknown, ..._arguments: Parameters<typeof fetch>): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- the receiver is exactly what this test is about
    receiver = this;

    return Response.json(tokens(idToken({})));
  } as typeof fetch;
  const adapter = signIn(fetcher);

  await adapter.subjectOf(callback);

  expect(receiver).not.toBe(adapter);
});
