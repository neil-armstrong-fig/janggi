import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";

/**
 * A board about to be laid out, with nobody having chosen yet.
 *
 * The format is asked for rather than defaulted, exactly as `newGame` asks for it: it decides
 * whether the order in `canPlace` is enforced at all, so picking one silently would decide the
 * game for every player — `docs/rules.md` §6.2.
 *
 * **Neither setup is defaulted to `DEFAULT_SETUP`, and that is load-bearing.** With a default,
 * `hanSetup` would be set from the first instant, so han could never lay out, cho could always
 * answer, `isArranged` would be a constant `true` and `newGameFrom` could never throw — the rule
 * would not weaken, it would vanish, and every test of it would pass saying nothing. `DEFAULT_SETUP`
 * is what a board shows before anyone has chosen, which is the store's business and not a rule's.
 */
export function setupPhaseFor(format: MatchFormat): SetupPhase {
  return {format, hanSetup: undefined, choSetup: undefined};
}
