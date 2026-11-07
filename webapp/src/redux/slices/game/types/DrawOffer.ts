import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * A draw one army has offered, and whether the other has turned it down. See `docs/rules.md` §6.4.
 *
 * It is the conversation before an agreement, and so lives beside the record rather than in it: an offer
 * takes nobody's turn, leaves nothing on the board and is no position to step back to. Only an accepted
 * one reaches the engine, as `agreeADraw`. It lapses with the next thing that happens — a move, a rested
 * turn, an undo — and a deal takes it away, so a declined offer stays only until the game moves on, which
 * is as long as the note saying so is worth showing.
 */
export interface DrawOffer {
  readonly by: Side;
  readonly declined: boolean;
}
