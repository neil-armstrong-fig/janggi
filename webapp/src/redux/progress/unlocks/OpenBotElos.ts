import type {BeatenElos, BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";

/**
 * The strengths of bot open to a player taking `choice` in `format`, weakest first.
 *
 * **Every rung is earned from the one below it**: the bottom is always open, and each strength above it
 * opens only once the strength beneath it has actually been beaten on that ladder. A ladder with a rung
 * missing therefore stops there, however high the rungs above it reach — which is what a hand-edited save
 * naming 2850 and nothing else comes to. Climbing is the point; the save key is for carrying a climb, not
 * for skipping one.
 *
 * Random may land on either army, so it is offered only what both have reached.
 */
export function openBotElos(beaten: BeatenLadders, format: MatchFormat, choice: SideChoiceName): readonly BotElo[] {
  const ladders = beaten[format];

  switch (choice) {
    case "Cho":
      return openTo(ladders.cho);
    case "Han":
      return openTo(ladders.han);
    case "Random": {
      const han = openTo(ladders.han);

      return openTo(ladders.cho).filter(elo => han.includes(elo));
    }
  }
}

/** Up to and including the first rung not yet beaten, which is the one there is to play for. */
function openTo(beaten: BeatenElos): readonly BotElo[] {
  const nextToBeat = BOT_ELOS.findIndex(elo => !beaten.includes(elo));

  return nextToBeat === -1 ? BOT_ELOS : BOT_ELOS.slice(0, nextToBeat + 1);
}
