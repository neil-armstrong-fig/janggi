import type {GameEnding} from "@src/redux/ratings/types/GameEnding";
import type {GameResult} from "@src/redux/ratings/types/GameResult";

/** How the game in progress ended, as the page saw it. Everything else about it is already held. */
export interface RatedGameFinish {
  readonly result: GameResult;
  readonly ending: GameEnding;
  /** ISO 8601. */
  readonly finishedAt: string;
}
