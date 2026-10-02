import {MAX_REQUEST_LENGTH} from "@src/handler/routes/MaxRequestLength";
import {MAX_SYNCED_DATA_LENGTH} from "@janggi/shared/janggi/account/SyncedDataLimit";
import type {Account} from "@src/database/types/Account";
import type {RouteServices} from "@src/handler/services/RouteServices";
import {respondEmpty} from "@src/handler/respond/RespondEmpty";
import {respondJson} from "@src/handler/respond/RespondJson";

/**
 * `PUT /api/data` — keeps the player's document if nobody has written since the version the writer read, which they say
 * in `If-Match`: two devices cannot overwrite each other, and the one that is behind is told the version to read again
 * from (409). The document is opaque here — a string, and a size — because only the app can say what is in it, and it
 * reads it as untrusted whatever it finds.
 */
export async function writeData(request: Request, account: Account, services: RouteServices): Promise<Response> {
  if (!(await services.dataLimiter.allow(account.id))) return respondEmpty(429);

  const expectedVersion = versionOf(request.headers.get("If-Match"));
  if (expectedVersion === undefined) return respondEmpty(428);

  const declared = Number(request.headers.get("Content-Length") ?? 0);
  if (declared > MAX_REQUEST_LENGTH) return respondEmpty(413);

  const text = await request.text();
  if (text.length > MAX_REQUEST_LENGTH) return respondEmpty(413);

  const blob = blobIn(text);
  if (blob === undefined) return respondEmpty(400);
  if (blob.length > MAX_SYNCED_DATA_LENGTH) return respondEmpty(413);

  const written = await services.store.writeData({userId: account.id, blob, expectedVersion, now: services.now()});

  return respondJson({version: written.version}, written.outcome === "written" ? 200 : 409);
}

function versionOf(header: string | null): number | undefined {
  return header !== null && /^\d+$/.test(header) ? Number(header) : undefined;
}

function blobIn(text: string): string | undefined {
  try {
    const body: unknown = JSON.parse(text);
    const blob = typeof body === "object" && body !== null ? (body as Record<string, unknown>)["blob"] : undefined;

    return typeof blob === "string" ? blob : undefined;
  } catch {
    return undefined;
  }
}
