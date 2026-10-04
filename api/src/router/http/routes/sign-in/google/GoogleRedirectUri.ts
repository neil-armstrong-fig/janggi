import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * Where Google is told to send the player back: this API's own callback on whichever host the request arrived — the one
 * registered with Google, so there is no second copy of the address to fall out of step with it. Local dev gives it outright
 * (`GOOGLE_REDIRECT_URI`), since `wrangler dev` reports the custom domain as the host.
 */
export function googleRedirectUri(request: Request): string {
  return workerEnvironment.GOOGLE_REDIRECT_URI ?? `${new URL(request.url).origin}/api/auth/google/callback`;
}
