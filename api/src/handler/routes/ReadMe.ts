import type {Account} from "@src/database/types/Account";
import {respondJson} from "@src/handler/respond/RespondJson";

/** `GET /api/me` — who the session belongs to: only the name they are called by. */
export function readMe(account: Account): Response {
  return respondJson({displayName: account.displayName});
}
