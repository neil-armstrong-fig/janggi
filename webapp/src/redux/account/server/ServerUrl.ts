import {serverOrigin} from "@src/redux/account/server/ServerOrigin";

/** The address of a path on the sign-in and sync API. */
export function serverUrl(path: string): string {
  return `${serverOrigin()}${path}`;
}
