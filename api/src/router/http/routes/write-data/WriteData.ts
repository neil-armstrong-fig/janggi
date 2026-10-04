import {writePlayerData} from "@src/database/data/WritePlayerData";
import {isRecord} from "@src/json/IsRecord";
import {MAX_REQUEST_LENGTH} from "@src/router/http/routes/write-data/request-length/MaxRequestLength";
import {MAX_SYNCED_DATA_LENGTH} from "@janggi/shared/janggi/account/SyncedDataLimit";
import type {Account} from "@src/database/types/Account";
import {dataWriteAllowed} from "@src/router/http/routes/rate-limit/DataWriteAllowed";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {respondJson} from "@src/router/http/routes/respond/RespondJson";

/**
 * `PUT /api/data` — keeps the player's document if nobody has written since the version the writer read, which they say
 * in `If-Match`: two devices cannot overwrite each other, and the one that is behind is told the version to read again
 * from (409). The document is opaque here — a string, and a size — because only the app can say what is in it, and it
 * reads it as untrusted whatever it finds.
 */
export async function writeData(request: Request, account: Account): Promise<Response> {
  if (!(await dataWriteAllowed(account.id))) return respondEmpty(429);

  const expectedVersion = versionOf(request.headers.get("If-Match"));
  if (expectedVersion === undefined) return respondEmpty(428);

  const declared = Number(request.headers.get("Content-Length") ?? 0);
  if (declared > MAX_REQUEST_LENGTH) return respondEmpty(413);

  const text = await request.text();
  if (text.length > MAX_REQUEST_LENGTH) return respondEmpty(413);

  const blob = blobIn(text);
  if (blob === undefined) return respondEmpty(400);
  if (blob.length > MAX_SYNCED_DATA_LENGTH) return respondEmpty(413);

  const written = await writePlayerData({userId: account.id, blob, expectedVersion, now: new Date()});
  if (written.outcome === "written") return respondJson({version: written.version}, 200);

  return respondJson({version: written.version}, 409);
}

function versionOf(header: string | null): number | undefined {
  if (header === null || !/^\d+$/.test(header)) return undefined;

  return Number(header);
}

function blobIn(text: string): string | undefined {
  try {
    const body: unknown = JSON.parse(text);
    if (!isRecord(body) || typeof body["blob"] !== "string") return undefined;

    return body["blob"];
  } catch {
    return undefined;
  }
}
