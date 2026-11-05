import type {Route} from "@playwright/test";

/** A request for a room: how to answer it, and the account asking, who may have one open at a time. */
export interface RoomRequest {
  readonly route: Route;
  readonly headers: Record<string, string>;
  readonly host: object;
}
