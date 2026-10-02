/** Google sending the player back: the code to exchange, the state it came back with, and the PKCE verifier it was started with. */
export interface GoogleCallback {
  readonly code: string;
  readonly state: string;
  readonly codeVerifier: string;
}
