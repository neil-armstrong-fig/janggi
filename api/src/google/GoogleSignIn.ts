import type {GoogleCallback} from "@src/google/types/GoogleCallback";

/**
 * What the API needs of Google: where to send the player to sign in, and who they are once they have. A narrow
 * interface so the routes are tested with a Google that answers as the test says, and the one real implementation
 * (`OAuth4WebapiGoogleSignIn`) is the only code that speaks OAuth.
 */
export interface GoogleSignIn {
  /** Google's consent screen for this attempt, which sends the player back to the API's callback with a code. */
  authorizationUrl(state: string, codeVerifier: string): Promise<URL>;
  /** Google's stable id for the player whose consent `code` is, or a thrown error where Google refuses it. */
  subjectOf(callback: GoogleCallback): Promise<string>;
}
