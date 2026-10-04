import type {Account} from "@src/database/types/Account";
import {readPlayerData} from "@src/database/data/ReadPlayerData";
import {respondJson} from "@src/router/http/routes/respond/RespondJson";

/** `GET /api/data` — what is kept for the player, and the version it is at; none yet is version 0 and no document. */
export async function readData(account: Account): Promise<Response> {
  const data = await readPlayerData(account.id);

  return respondJson({version: data?.version ?? 0, blob: data?.blob ?? null});
}
