import type {Move} from "@src/game/types/Move";

/** The bot plays a move. */
interface Moves {
  readonly kind: "move";
  readonly move: Move;
}

/** 한수쉼 — the bot rests its turn. Not a `Move`, for the reason `types/Move.ts` gives. */
interface Passes {
  readonly kind: "pass";
}

/** The bot calls the bikjang standing on the board. Nothing moves and nobody's turn is taken. */
interface CallsBikjang {
  readonly kind: "callBikjang";
}

/**
 * Whatever the bot decides to do on its turn — the three things `record/` advances by, and nothing
 * else, so the page can hand each straight to the store action that already plays it.
 */
export type BotTurn = Moves | Passes | CallsBikjang;
