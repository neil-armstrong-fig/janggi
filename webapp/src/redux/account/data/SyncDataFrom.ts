import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import type {DeletedStyle} from "@src/redux/account/ledger/types/DeletedStyle";
import type {StampedStyle} from "@src/redux/account/data/types/StampedStyle";
import type {SyncData} from "@src/redux/account/data/types/SyncData";
import {STYLE_KINDS} from "@janggi/shared/janggi/settings/StyleKind";
import {SYNC_DATA_VERSION} from "@src/redux/account/data/SyncDataVersion";
import {boardStyleFrom} from "@src/redux/custom-styles/untrusted/BoardStyleFrom";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";
import {pieceSetStyleFrom} from "@src/redux/custom-styles/untrusted/PieceSetStyleFrom";
import {progressFrom} from "@src/redux/progress/progress-from/ProgressFrom";
import {ratingsFrom} from "@src/redux/ratings/ratings-from/RatingsFrom";
import {syncedPreferencesOf} from "@src/redux/preferences/synced/SyncedPreferencesOf";
import {storedPreferencesFrom} from "@src/redux/preferences/preferences-from/StoredPreferencesFrom";

/**
 * The document the server holds, read from its text — or undefined where it is not one this app can read: not
 * JSON, not an object, another version, or without progress to hold it up.
 *
 * Read like everything that comes from outside the app, a part at a time and as narrowly as it fails. The server
 * keeps what it is sent without looking, so this is the only check there is, and a style in it is drawn onto the
 * board as surely as one pasted by hand: each is run through the same check that one is.
 */
export function syncDataFrom(text: string): SyncData | undefined {
  const document = parsed(text);
  if (!isObject(document) || document["v"] !== SYNC_DATA_VERSION) return undefined;

  const progress = progressFrom(document["progress"]);
  if (!progress) return undefined;

  const styles = isObject(document["styles"]) ? document["styles"] : {};
  const ratings = isObject(document["ratings"]) ? document["ratings"] : {};
  const preferences = isObject(document["preferences"]) ? document["preferences"] : {};

  return {
    progress,
    styles: {
      boards: stampedIn(styles["boards"], boardStyleFrom),
      pieceSets: stampedIn(styles["pieceSets"], pieceSetStyleFrom),
      deleted: deletedIn(styles["deleted"]),
    },
    ratings: {
      byFormat: ratingsFrom(document["ratings"]).byFormat,
      resetAt: typeof ratings["resetAt"] === "string" ? ratings["resetAt"] : undefined,
    },
    preferences: {
      value: syncedPreferencesOf(storedPreferencesFrom(preferences["value"])),
      at: isFiniteNumber(preferences["at"]) ? preferences["at"] : 0,
    },
  };
}

function parsed(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function stampedIn<Style extends CustomStyle>(
  value: unknown,
  check: (style: unknown) => Checked<Style>,
): readonly StampedStyle<Style>[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry: unknown) => {
    if (!isObject(entry) || typeof entry["id"] !== "string" || !isFiniteNumber(entry["at"])) return [];

    const checked = check(entry["style"]);
    if (checked.kind === "accepted") {
      return [{id: entry["id"], at: entry["at"], style: checked.value}];
    }

    return [];
  });
}

function deletedIn(value: unknown): readonly DeletedStyle[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry: unknown) => {
    if (!isObject(entry)) return [];

    const {kind, id, at} = entry;
    if (isAmong(STYLE_KINDS, kind) && typeof id === "string" && isFiniteNumber(at)) {
      return [{kind, id, at}];
    }

    return [];
  });
}
