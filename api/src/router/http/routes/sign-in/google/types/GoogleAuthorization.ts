/** What starts a sign-in with Google: the state and PKCE verifier this attempt made, and where Google is to send the player back. */
export interface GoogleAuthorization {
  readonly state: string;
  readonly codeVerifier: string;
  readonly redirectUri: string;
}
