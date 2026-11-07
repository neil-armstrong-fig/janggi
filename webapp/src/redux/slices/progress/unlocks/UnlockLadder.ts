import type {UnlockItem} from "@src/redux/slices/progress/unlocks/types/UnlockItem";
import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import {UNLOCK_PRICES} from "@src/redux/slices/progress/unlocks/UnlockPrices";
import type {UnlockStep} from "@src/redux/slices/progress/unlocks/types/UnlockStep";
import {isAmong} from "@src/redux/shared/untrusted/IsAmong";

/**
 * Everything XP opens, cheapest first, one step per amount — read off `UNLOCK_PRICES` so the ladder a
 * player is shown cannot disagree with the locks they meet.
 *
 * A board and a piece set of one name at one price are a theme and are named once as that. What is open
 * from the start is not a step at all.
 */
export function unlockLadder(): readonly UnlockStep[] {
  const itemsByXp = new Map<number, UnlockItem[]>();
  const add = (xp: number, item: UnlockItem): void => {
    itemsByXp.set(xp, [...(itemsByXp.get(xp) ?? []), item]);
  };

  BOARD_STYLE_NAMES.forEach(name => {
    return add(UNLOCK_PRICES.boardStyles[name], {kind: isTheme(name) ? "theme" : "board", name});
  });

  PIECE_SET_NAMES.forEach(name => {
    if (!isTheme(name)) add(UNLOCK_PRICES.pieceSets[name], {kind: "pieces", name});
  });

  add(UNLOCK_PRICES.styleEditor, {kind: "style-editor"});

  return [...itemsByXp]
    .filter(([xp]) => xp > 0)
    .sort(([cheaper], [dearer]) => cheaper - dearer)
    .map(([xp, items]) => ({xp, items}));
}

function isTheme(name: string): boolean {
  return (
    isAmong(BOARD_STYLE_NAMES, name) &&
    isAmong(PIECE_SET_NAMES, name) &&
    UNLOCK_PRICES.boardStyles[name] === UNLOCK_PRICES.pieceSets[name]
  );
}
