import type {DrawnBy} from "@janggi/shared/janggi/results/DrawnBy";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * What the result banner says beside the Korean word that names the ending — which stands as it is in
 * every language, being the game's own term — and on its buttons.
 */
export interface ResultMessages {
  readonly won: (side: Side) => string;
  readonly wonOnPoints: (side: Side) => string;
  readonly drawn: Record<DrawnBy, string>;
  readonly newGame: string;
  readonly showBoard: string;
  readonly newGameAt: (botElo: number) => string;
  /** How the bot is named as the one who called a bikjang, given the army it plays. */
  readonly botPlaying: (side: Side) => string;
  /** A called bikjang, told to someone who has never met one; `drawn` is whether it drew the game or sent it to the points. */
  readonly bikjangExplanation: (caller: string, drawn: boolean) => string;
  /** A repetition that ended the game; `drawn` is whether it drew the game or sent it to the points. */
  readonly repetitionExplanation: (drawn: boolean) => string;
}
