import * as oauth from "oauth4webapi";
import {GOOGLE} from "@src/router/http/routes/sign-in/google/GoogleEndpoints";
import type {GoogleAuthorization} from "@src/router/http/routes/sign-in/google/types/GoogleAuthorization";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * Where to send a player to sign in with Google: its consent screen, asking for the OAuth 2.0 authorization-code flow with PKCE
 * and the scope `openid` alone, so the only thing Google ever tells the API is the player's stable id — never their name or email.
 */
export async function googleAuthorizationUrl({state, codeVerifier, redirectUri}: GoogleAuthorization): Promise<URL> {
  const url = new URL(GOOGLE.authorization_endpoint ?? "");

  url.searchParams.set("client_id", workerEnvironment.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", await oauth.calculatePKCECodeChallenge(codeVerifier));
  url.searchParams.set("code_challenge_method", "S256");

  return url;
}
