import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {place} from "@src/game/setups/Place";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

/**
 * The phase a game of this format begins in — and the one place the two formats start differently.
 *
 * **Scored** starts with nobody having chosen, because laying out is a real act there: Han arranges
 * first, Cho answers having seen it, and Han may not revise. A phase handed a default would have
 * Han looking as though it had already chosen, which is exactly the trap `setupPhaseFor` warns
 * against — the rule would not weaken, it would vanish.
 *
 * **Casual** is dealt with both armies already on the common arrangement, which is what the app has
 * always done. 「판차림의 순서」 is a regulation of official play, so a friendly game is not held to
 * it, and there is nothing to wait for before the pieces go out.
 *
 * This is the store's business rather than the engine's: `DEFAULT_SETUP` is what a board *shows*
 * before anyone has chosen, and the engine deliberately refuses to know about it.
 */
export function freshPhaseFor(format: MatchFormat): SetupPhase {
  const nobodyHasChosen = setupPhaseFor(format);

  if (format !== "Casual") return nobodyHasChosen;

  return place(place(nobodyHasChosen, "han", DEFAULT_SETUP), "cho", DEFAULT_SETUP);
}
