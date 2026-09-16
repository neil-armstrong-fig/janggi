import type {BeatenBySide, BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * The ladders with one more rung beaten on one of them — that army, in that format, and nowhere else.
 *
 * A strength already beaten is left where it is rather than added again: the ladder is a set of rungs
 * climbed, and the order they were first climbed in is all it keeps.
 */
export function withBeaten(beaten: BeatenLadders, format: MatchFormat, side: Side, elo: BotElo): BeatenLadders {
  const ladders = beaten[format];
  if (ladders[side].includes(elo)) return beaten;

  const climbed: BeatenBySide = {...ladders, [side]: [...ladders[side], elo]};

  return {...beaten, [format]: climbed};
}
