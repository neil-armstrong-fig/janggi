import type {Account} from "@src/database/types/Account";
import type {RouteServices} from "@src/handler/services/RouteServices";
import {respondJson} from "@src/handler/respond/RespondJson";

/** `GET /api/data` — what is kept for the player, and the version it is at; none yet is version 0 and no document. */
export async function readData(account: Account, services: RouteServices): Promise<Response> {
  const data = await services.store.readData(account.id);

  return respondJson({version: data?.version ?? 0, blob: data?.blob ?? null});
}
