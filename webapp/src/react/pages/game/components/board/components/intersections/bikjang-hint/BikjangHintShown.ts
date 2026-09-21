import type {BikjangHint} from "@src/react/pages/game/types/BikjangHint";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {Opponent} from "@src/redux/game/types/Opponent";

/**
 * Whether the board labels the moves that could allow a bikjang, which is the player's preference
 * *and* a question of who is on the other side.
 *
 * The hint is a teaching aid, so it is offered where a player is still learning: in a game against a
 * person at the same device, and against the two weakest bots. Against the stronger ones it is never
 * drawn, whatever the preference says — the preference is asked first only so that "Hidden" is
 * "Hidden" everywhere. That the opponent's strength is kept while the opponent is a person is why
 * `name` is asked before `botElo`.
 */
export function bikjangHintShown(hint: BikjangHint, opponent: Opponent): boolean {
  if (!hint.shown) return false;

  if (opponent.name === "Human") return true;

  return BOTS_WITH_THE_HINT.some(elo => elo === opponent.botElo);
}

/** The strengths of bot the hint is offered against. A display policy, so it is not `shared/`'s. */
const BOTS_WITH_THE_HINT = [800, 1000] as const satisfies readonly BotElo[];
