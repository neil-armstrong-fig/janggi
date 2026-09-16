import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What the bot is asked when it has a scored game's back rank to lay out. */
export interface SetupQuestion {
  readonly side: Side;
  /** What Han laid out, which a Cho layout answers — undefined when laying out Han, which goes first. */
  readonly hanSetup: Setup | undefined;
  readonly elo: BotElo;
  /** A number in [0, 1), as `Math.random` gives one, picking among the setups rated near the best. */
  readonly roll: number;
  /** Stops the searches part-way, for a layout nobody is waiting for any more. */
  readonly signal: AbortSignal;
}
