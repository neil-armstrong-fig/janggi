import type {GameRecord} from "@src/redux/ratings/types/GameRecord";

/** The player's standing in one match format: a rating, and every game that made it, oldest first. */
export interface FormatRating {
  readonly elo: number;
  readonly games: readonly GameRecord[];
}
