import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import type {Deletions} from "@src/redux/account/merging/merged-styles/types/Deletions";
import type {StylesToMerge} from "@src/redux/account/merging/merged-styles/types/StylesToMerge";
import type {DeletedStyle} from "@src/redux/account/ledger/types/DeletedStyle";
import type {StampedStyle} from "@src/redux/account/data/types/StampedStyle";
import type {SyncedStyles} from "@src/redux/account/data/types/SyncedStyles";
import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import {added} from "@src/redux/custom-styles/joining/Added";

/**
 * The player's own styles on two devices as one list: a style on both is the one most recently changed, a style
 * deleted on either is gone unless it was changed after, and a style on only one is kept.
 *
 * Styles are told apart by id, never by name. Settling a style against a deletion goes by time: the later of its
 * last change and its deletion wins, and a tie keeps the style, so nothing the player made is lost to a clock that
 * disagreed by a millisecond. A device whose clock is badly wrong can win a settlement it should not; that is
 * accepted for a game's cosmetics.
 *
 * Two styles with different ids can still come out with one name — each device made a "Mine" — and a name picks a
 * style out, so the one met second is numbered the way an imported style is. The same style under two ids, each
 * device having been given it by the same key, is one style, and the lower id is kept so every device agrees.
 */
export function mergedStyles(local: SyncedStyles, remote: SyncedStyles): SyncedStyles {
  const deleted = mergedDeletions(local.deleted, remote.deleted);

  return {
    boards: mergedList({
      kind: "Board",
      local: local.boards,
      remote: remote.boards,
      deletions: deleted,
      builtIns: BOARD_STYLE_NAMES,
    }),
    pieceSets: mergedList({
      kind: "Pieces",
      local: local.pieceSets,
      remote: remote.pieceSets,
      deletions: deleted,
      builtIns: PIECE_SET_NAMES,
    }),
    deleted: [...deleted.values()],
  };
}

function mergedDeletions(local: readonly DeletedStyle[], remote: readonly DeletedStyle[]): Deletions {
  const latest = new Map<string, DeletedStyle>();

  [...local, ...remote].forEach(deletion => {
    const known = latest.get(deletion.id);

    if (!known || deletion.at > known.at) latest.set(deletion.id, deletion);
  });

  return latest;
}

function mergedList<Style extends CustomStyle>({
  kind,
  local,
  remote,
  deletions,
  builtIns,
}: StylesToMerge<Style>): readonly StampedStyle<Style>[] {
  const survivors = [...newestPerId(local, remote)].filter(entry => !isDeleted(kind, entry, deletions));

  return withoutCopies(survivors).reduce<readonly StampedStyle<Style>[]>((merging, entry) => {
    const [taken] = added(
      merging.map(held => held.style),
      entry.style,
      builtIns,
    ).slice(-1);

    return [...merging, {...entry, style: taken ?? entry.style}];
  }, []);
}

/** Each id once, in the order this device holds them and then the other's, as the newest version of it. */
function newestPerId<Style extends CustomStyle>(
  local: readonly StampedStyle<Style>[],
  remote: readonly StampedStyle<Style>[],
): readonly StampedStyle<Style>[] {
  const newest = new Map<string, StampedStyle<Style>>();

  [...local, ...remote].forEach(entry => {
    const known = newest.get(entry.id);

    if (!known || entry.at > known.at) newest.set(entry.id, entry);
  });

  return [...newest.values()];
}

function isDeleted(kind: DeletedStyle["kind"], entry: StampedStyle<CustomStyle>, deletions: Deletions): boolean {
  const deletion = deletions.get(entry.id);

  return deletion !== undefined && deletion.kind === kind && deletion.at > entry.at;
}

/** Of styles that are the same style under different ids, the one with the lowest id. */
function withoutCopies<Style extends CustomStyle>(
  entries: readonly StampedStyle<Style>[],
): readonly StampedStyle<Style>[] {
  return entries.filter(
    entry => !entries.some(other => other.id < entry.id && JSON.stringify(other.style) === JSON.stringify(entry.style)),
  );
}
