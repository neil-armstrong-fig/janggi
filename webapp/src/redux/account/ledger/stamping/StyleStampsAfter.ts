import type {DeletedStyle} from "@src/redux/account/ledger/types/DeletedStyle";
import type {KindOfStyleChange} from "@src/redux/account/ledger/types/KindOfStyleChange";
import type {StampingContext} from "@src/redux/account/ledger/types/StampingContext";
import type {StyleChange} from "@src/redux/account/ledger/types/StyleChange";
import type {StyleStamp} from "@src/redux/account/ledger/types/StyleStamp";
import type {StyleStamps} from "@src/redux/account/ledger/types/StyleStamps";

/**
 * The ledger for the player's own styles once they go from `previous` to `next`: a style new to the list is
 * given an id and the time, one whose content changed is given the time and keeps its id, and one that has gone
 * is remembered as deleted.
 *
 * Told by name, which is how the list tells styles apart. A style saved under another name is a new style and
 * the old one is still there; one deleted and made again under the same name is a new style with a new id, so
 * the deletion of the first can never take the second with it.
 *
 * Called with the same list as `previous` and `next`, it only catches the ledger up with a list it has fallen
 * behind — styles from before there was a ledger, with nothing to say when they were made.
 */
export function styleStampsAfter({previous, next, ledger}: StyleChange, context: StampingContext): StyleStamps {
  const boards = stampsFor(
    {kind: "Board", previous: previous.boards, next: next.boards, ledger: ledger.boards},
    context,
  );
  const pieceSets = stampsFor(
    {kind: "Pieces", previous: previous.pieceSets, next: next.pieceSets, ledger: ledger.pieceSets},
    context,
  );

  return {
    boards: boards.stamps,
    pieceSets: pieceSets.stamps,
    deleted: [...ledger.deleted, ...boards.deleted, ...pieceSets.deleted],
  };
}

interface KindStamps {
  readonly stamps: Record<string, StyleStamp>;
  readonly deleted: readonly DeletedStyle[];
}

function stampsFor({kind, previous, next, ledger}: KindOfStyleChange, {now, newId}: StampingContext): KindStamps {
  const stamps = Object.fromEntries(
    next.map(style => {
      const known = ledger[style.name];
      const before = previous.find(old => old.name === style.name);

      if (!known) return [style.name, {id: newId(), at: now}];
      if (before && JSON.stringify(before) !== JSON.stringify(style)) return [style.name, {id: known.id, at: now}];

      return [style.name, known];
    }),
  );
  const deleted = previous.flatMap(old => {
    const known = ledger[old.name];
    if (known && !next.some(style => style.name === old.name)) {
      return [{kind, id: known.id, at: now}];
    }

    return [];
  });

  return {stamps, deleted};
}
