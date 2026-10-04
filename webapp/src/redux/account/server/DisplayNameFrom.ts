import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";
import {isObject} from "@src/redux/untrusted/IsObject";

/**
 * The display name in what the server answered for the account, or undefined where it said none or one that is not a
 * name. Run through the same check the server runs, because it is shown on the page and an answer from outside the
 * app is never trusted to be what it claims.
 */
export function displayNameFrom(body: unknown): string | undefined {
  if (isObject(body) && typeof body["displayName"] === "string") {
    return cleanedDisplayName(body["displayName"]);
  }

  return undefined;
}
