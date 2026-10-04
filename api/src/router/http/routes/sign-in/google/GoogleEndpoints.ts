import type {AuthorizationServer} from "oauth4webapi";

/** Google's OpenID Connect endpoints, written out: they have not moved in years, and a discovery fetch per sign-in would be one more call to make and trust. */
export const GOOGLE: AuthorizationServer = {
  issuer: "https://accounts.google.com",
  authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  token_endpoint: "https://oauth2.googleapis.com/token",
  jwks_uri: "https://www.googleapis.com/oauth2/v3/certs",
  code_challenge_methods_supported: ["S256"],
};
