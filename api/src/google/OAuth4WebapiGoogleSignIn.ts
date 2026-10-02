import * as oauth from "oauth4webapi";
import type {AuthorizationServer, Client} from "oauth4webapi";
import type {GoogleCallback} from "@src/google/types/GoogleCallback";
import type {GoogleSignIn} from "@src/google/GoogleSignIn";

/** Google's OpenID Connect endpoints, written out: they have not moved in years, and a discovery fetch per sign-in would be one more call to make and trust. */
const GOOGLE: AuthorizationServer = {
  issuer: "https://accounts.google.com",
  authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  token_endpoint: "https://oauth2.googleapis.com/token",
  jwks_uri: "https://www.googleapis.com/oauth2/v3/certs",
  code_challenge_methods_supported: ["S256"],
};

/**
 * `GoogleSignIn` over Google's OAuth 2.0 authorization-code flow with PKCE, through `oauth4webapi` — a small, maintained,
 * dependency-free library that does the checks (state, the token response, the ID token's issuer, audience and expiry) and
 * nothing else. It asks for no scope beyond `openid`, so the only thing Google ever tells the API is the player's stable id —
 * never their name or email.
 *
 * The ID token's signature is not verified, as OpenID Connect allows for a token received directly from the token endpoint over
 * TLS, which is where this one comes from: nothing a browser could have tampered with passes through.
 *
 * `fetcher` is the platform's `fetch`, wrapped so it is never called as a method of this class (see `subjectOf`), unless a test
 * hands in Google's side of the conversation.
 */
export class OAuth4WebapiGoogleSignIn implements GoogleSignIn {
  private readonly client: Client;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly fetcher: typeof fetch;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    fetcher: typeof fetch = (input, init) => fetch(input, init),
  ) {
    this.client = {client_id: clientId};
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.fetcher = fetcher;
  }

  async authorizationUrl(state: string, codeVerifier: string): Promise<URL> {
    const url = new URL(GOOGLE.authorization_endpoint ?? "");

    url.searchParams.set("client_id", this.client.client_id);
    url.searchParams.set("redirect_uri", this.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid");
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", await oauth.calculatePKCECodeChallenge(codeVerifier));
    url.searchParams.set("code_challenge_method", "S256");

    return url;
  }

  async subjectOf({code, state, codeVerifier}: GoogleCallback): Promise<string> {
    // Taken off `this` first: the Workers runtime's `fetch` throws "Illegal invocation" when called as a method of anything
    // but the global, and `this.fetcher(...)` would be exactly that.
    const fetcher = this.fetcher;
    const parameters = oauth.validateAuthResponse(GOOGLE, this.client, new URLSearchParams({code, state}), state);
    const response = await oauth.authorizationCodeGrantRequest(
      GOOGLE,
      this.client,
      oauth.ClientSecretPost(this.clientSecret),
      parameters,
      this.redirectUri,
      codeVerifier,
      {[oauth.customFetch]: (...args) => fetcher(...args)},
    );
    const result = await oauth.processAuthorizationCodeResponse(GOOGLE, this.client, response);
    const claims = oauth.getValidatedIdTokenClaims(result);

    if (claims === undefined) throw new Error("Google's answer did not say who the player is.");

    return claims.sub;
  }
}
