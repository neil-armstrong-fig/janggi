import * as oauth from "oauth4webapi";
import {GOOGLE} from "@src/router/http/routes/sign-in/google/GoogleEndpoints";
import type {GoogleExchange} from "@src/router/http/routes/sign-in/google/types/GoogleExchange";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * Who the player is, as Google says: the stable id (`sub`) of the account a code was issued for. Exchanges the code at Google's
 * token endpoint through `oauth4webapi` — a small, maintained, dependency-free library that does the checks (state, the token
 * response, the ID token's issuer, audience and expiry) and nothing else. Throws where Google refuses, or says nothing of who.
 *
 * The ID token's signature is not verified, as OpenID Connect allows for a token received directly from the token endpoint over
 * TLS, which is where this one comes from: nothing a browser could have tampered with passes through.
 */
export async function googleSubjectOf({code, state, codeVerifier, redirectUri}: GoogleExchange): Promise<string> {
  const client = {client_id: workerEnvironment.GOOGLE_CLIENT_ID};
  const parameters = oauth.validateAuthResponse(GOOGLE, client, new URLSearchParams({code, state}), state);
  const response = await oauth.authorizationCodeGrantRequest(
    GOOGLE,
    client,
    oauth.ClientSecretPost(workerEnvironment.GOOGLE_CLIENT_SECRET),
    parameters,
    redirectUri,
    codeVerifier,
    // The platform's `fetch`, called as a plain function: the Workers runtime throws "Illegal invocation" when it is called as a
    // method of anything but the global.
    {[oauth.customFetch]: (input, init) => fetch(input, init)},
  );
  const result = await oauth.processAuthorizationCodeResponse(GOOGLE, client, response);
  const claims = oauth.getValidatedIdTokenClaims(result);
  if (claims === undefined) throw new Error("Google's answer did not say who the player is.");

  return claims.sub;
}
