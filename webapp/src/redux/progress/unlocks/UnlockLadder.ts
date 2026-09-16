import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import {UNLOCK_PRICES} from "@src/redux/progress/unlocks/UnlockPrices";
import type {UnlockStep} from "@src/redux/progress/unlocks/types/UnlockStep";
import {isAmong} from "@src/redux/untrusted/IsAmong";

/**
 * Everything XP opens, cheapest first, one step per amount — read off `UNLOCK_PRICES` so the ladder a
 * player is shown cannot disagree with the locks they meet.
 *
 * A board and a piece set of one name at one price are a theme and are named once as that. What is open
 * from the start is not a step at all.
 */
export function unlockLadder(): readonly UnlockStep[] {
  const labelsByXp = new Map<number, string[]>();
  const add = (xp: number, label: string): void => {
    labelsByXp.set(xp, [...(labelsByXp.get(xp) ?? []), label]);
  };

  BOARD_STYLE_NAMES.forEach(name =>
    add(UNLOCK_PRICES.boardStyles[name], `${name} ${isTheme(name) ? "theme" : "board"}`),
  );

  PIECE_SET_NAMES.forEach(name => {
    if (!isTheme(name)) add(UNLOCK_PRICES.pieceSets[name], `${name} pieces`);
  });

  add(UNLOCK_PRICES.styleEditor, "Creating your own styles");

  return [...labelsByXp]
    .filter(([xp]) => xp > 0)
    .sort(([cheaper], [dearer]) => cheaper - dearer)
    .map(([xp, labels]) => ({xp, labels}));
}

function isTheme(name: string): boolean {
  return (
    isAmong(BOARD_STYLE_NAMES, name) &&
    isAmong(PIECE_SET_NAMES, name) &&
    UNLOCK_PRICES.boardStyles[name] === UNLOCK_PRICES.pieceSets[name]
  );
}
