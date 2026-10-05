import type {GameEnding} from "@janggi/shared/janggi/results/GameEnding";
import type {GameResult} from "@janggi/shared/janggi/results/GameResult";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The record sheet: how the player has done against the bot. */
export interface RecordMessages {
  /** What the button that opens it and its heading are called. */
  readonly title: string;
  readonly closeLabel: string;
  /** The rating, named for the format it belongs to. */
  readonly rating: (format: string) => string;
  readonly bot: string;
  readonly games: string;
  readonly winsDrawsLosses: string;
  readonly winRate: string;
  readonly winRateAs: (side: Side) => string;
  readonly noGames: string;
  readonly gameLine: (botElo: number, side: Side) => string;
  readonly results: Record<GameResult, string>;
  readonly endings: Record<GameEnding, string>;
  readonly reset: string;
  readonly resetLabel: string;
  readonly resetQuestion: string;
  readonly keepIt: string;
  readonly resetConfirm: string;
}
