import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";

/** One question put to the engine: a position, how it was reached, and what it may answer with. */
export interface Search {
  /** The position the history starts from — the last one no move can come back to. */
  readonly fen: string;
  /** Every turn played since `fen`, in the engine's notation, so it can see a repetition coming. */
  readonly moves: readonly string[];
  /** The only answers it may give. Never empty. */
  readonly searchMoves: readonly string[];
  readonly elo: BotElo;
  readonly moveTimeMs: number;
}
