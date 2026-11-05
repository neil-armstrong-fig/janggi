import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {TakenSlot} from "@src/react/pages/game/components/status/components/player-plaque/components/taken-tray/types/TakenSlot";

/**
 * The tray's places, one per kind an army can lose, whether or not any have been: most valuable first, the order of
 * `docs/rules.md` §6.5, with the tied elephant and guard as that table has them. A kind holds its place so that nothing
 * moves when a piece is taken. The general has none, being checkmated rather than taken.
 */
export function takenSlotsFrom(taken: readonly PieceType[]): readonly TakenSlot[] {
  return KINDS_MOST_VALUABLE_FIRST.map(type => ({type, count: taken.filter(piece => piece === type).length}));
}

const KINDS_MOST_VALUABLE_FIRST: readonly PieceType[] = ["chariot", "cannon", "horse", "elephant", "guard", "soldier"];
