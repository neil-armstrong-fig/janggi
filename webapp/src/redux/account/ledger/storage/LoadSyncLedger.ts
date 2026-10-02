import {STYLE_KINDS} from "@janggi/shared/janggi/settings/StyleKind";
import {SYNC_LEDGER_STORAGE_KEY} from "@src/redux/account/ledger/storage/SyncLedgerStorageKey";
import type {StyleStamp} from "@src/redux/account/ledger/types/StyleStamp";
import type {SyncLedgerSliceState} from "@src/redux/account/ledger/types/SyncLedgerSliceState";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";
import {readJson} from "@src/redux/device-storage/ReadJson";

/**
 * The ledger kept on the device, each part checked on its own. What does not check out is left out, and the ledger
 * is then caught up with the styles the device holds (`createStore`) — the worst a broken one can do is make a style
 * look as old as the beginning of time.
 */
export function loadSyncLedger(storage: Pick<Storage, "getItem"> | undefined): SyncLedgerSliceState {
  const stored = readJson(storage, SYNC_LEDGER_STORAGE_KEY);
  const ledger = isObject(stored) ? stored : {};

  return {
    boards: stampsFrom(ledger["boards"]),
    pieceSets: stampsFrom(ledger["pieceSets"]),
    deleted: Array.isArray(ledger["deleted"]) ? ledger["deleted"].flatMap(deletionFrom) : [],
    preferencesAt: isFiniteNumber(ledger["preferencesAt"]) ? ledger["preferencesAt"] : 0,
    ratingsResetAt: typeof ledger["ratingsResetAt"] === "string" ? ledger["ratingsResetAt"] : undefined,
  };
}

function stampsFrom(value: unknown): Record<string, StyleStamp> {
  if (!isObject(value)) return {};

  return Object.fromEntries(
    Object.entries(value).flatMap(([name, stamp]) =>
      isObject(stamp) && typeof stamp["id"] === "string" && isFiniteNumber(stamp["at"])
        ? [[name, {id: stamp["id"], at: stamp["at"]}]]
        : [],
    ),
  );
}

function deletionFrom(value: unknown): SyncLedgerSliceState["deleted"] {
  if (!isObject(value)) return [];

  const {kind, id, at} = value;

  return isAmong(STYLE_KINDS, kind) && typeof id === "string" && isFiniteNumber(at) ? [{kind, id, at}] : [];
}
