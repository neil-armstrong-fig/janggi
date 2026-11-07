import {serverOrigin} from "@src/redux/slices/account/server/ServerOrigin";

/** The address of a path on the sign-in and sync API. */
export function serverUrl(path: string): string {
  return `${serverOrigin()}${path}`;
}
