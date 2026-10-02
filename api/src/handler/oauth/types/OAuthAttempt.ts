/** What the callback must find to accept the player coming back: the state it sent, the PKCE verifier, and where to go. */
export interface OAuthAttempt {
  readonly state: string;
  readonly codeVerifier: string;
  readonly returnTo: string;
}
