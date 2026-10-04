import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import type {Preferences} from "@src/react/pages/game/hooks/use-preferences/types/Preferences";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";

/** The most a key may be: what `decodeKey` will read, so a longer one would only be thrown away at the other end. */
const LONGEST_KEY = 64_000;

/** The name a player who has none to give is introduced by. */
const NO_NAME = "Player";

interface WhoIAm {
  readonly displayName: string | undefined;
  /** What the player wears. Their own, not the friend's: it is what is shared. */
  readonly worn: Pick<Preferences, "armyBoardStyles" | "armyPieceSets">;
  /** Whether the player shows the friend's look and, in turn, shares their own. */
  readonly sharesLook: boolean;
}

/**
 * What a player says of themselves on sitting down: the name they have, and — unless they have turned showing the
 * opponent's look off, which turns sharing their own off with it — the board and the set they play in, as share keys (the
 * board of Cho's half and Cho's set, which are the one board and set unless the player has split them). A key too long for the other end to read is left out rather than sent.
 */
export function introductionFrom({displayName, worn, sharesLook}: WhoIAm): Introduction {
  const name = displayName ?? NO_NAME;
  if (!sharesLook) return {displayName: name};

  const boardKey = encodeKey("board", worn.armyBoardStyles.cho);
  const piecesKey = encodeKey("pieces", worn.armyPieceSets.cho);

  return {
    displayName: name,
    ...(boardKey.length <= LONGEST_KEY ? {boardKey} : {}),
    ...(piecesKey.length <= LONGEST_KEY ? {piecesKey} : {}),
  };
}
