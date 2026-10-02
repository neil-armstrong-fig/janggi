import {serverUrl} from "@src/redux/account/server/ServerUrl";

/**
 * A call to the sign-in and sync API, carrying the session cookie it set — the API is on its own host, so a
 * cookie only goes with a request that asks for credentials.
 */
export function callServer(path: string, init?: RequestInit): Promise<Response> {
  return fetch(serverUrl(path), {...init, credentials: "include"});
}
