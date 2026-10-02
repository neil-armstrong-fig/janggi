import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";
import type {Account} from "@src/database/types/Account";
import type {RouteServices} from "@src/handler/services/RouteServices";
import {respondEmpty} from "@src/handler/respond/RespondEmpty";
import {respondJson} from "@src/handler/respond/RespondJson";

/**
 * `PATCH /api/me` — changes the display name. Checked by the shared rule the app checks with, because the API trusts
 * nothing it is sent: a name that is not one is a 400, and what is kept is the tidied name, which is answered back so
 * the app shows what was kept rather than what was typed.
 */
export async function renameMe(request: Request, account: Account, services: RouteServices): Promise<Response> {
  const body: unknown = await request.json().catch(() => undefined);
  const typed =
    typeof body === "object" && body !== null ? (body as Record<string, unknown>)["displayName"] : undefined;
  const name = typeof typed === "string" ? cleanedDisplayName(typed) : undefined;

  if (name === undefined) return respondEmpty(400);

  await services.store.renameAccount(account.id, name);

  return respondJson({displayName: name});
}
