import {isRecord} from "@src/json/IsRecord";
import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";
import type {Account} from "@src/database/types/Account";
import {renameAccount} from "@src/database/accounts/RenameAccount";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {respondJson} from "@src/router/http/routes/respond/RespondJson";

/**
 * `PATCH /api/me` — changes the display name. Checked by the shared rule the app checks with, because the API trusts
 * nothing it is sent: a name that is not one is a 400, and what is kept is the tidied name, which is answered back so
 * the app shows what was kept rather than what was typed.
 */
export async function renameMe(request: Request, account: Account): Promise<Response> {
  const body: unknown = await request.json().catch(() => undefined);
  if (!isRecord(body) || typeof body["displayName"] !== "string") return respondEmpty(400);

  const name = cleanedDisplayName(body["displayName"]);
  if (name === undefined) return respondEmpty(400);

  await renameAccount(account.id, name);

  return respondJson({displayName: name});
}
