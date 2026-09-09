import type {ArrangedSetupPhase, SetupPhase} from "@src/game/setups/types/SetupPhase";

/**
 * Whether both armies have chosen, so there is a board to start a game on.
 *
 * Asked of either format alike. Which army may choose *when* is the scored game's rule and lives in
 * `canPlace`; having both back ranks is simply what a position is made of, and no format plays
 * without one.
 *
 * It is `is…` rather than a `can…` paired with `newGameFrom` because there is exactly one reason a
 * game cannot start yet, and it is a state of the phase rather than a permission — which is
 * `isBikjang`'s shape, not `canPass`'s.
 *
 * It narrows as it answers, so `newGameFrom` reaches the two setups through this one question rather
 * than asking a second time in its own words — two guards that could drift apart.
 */
export function isArranged(phase: SetupPhase): phase is ArrangedSetupPhase {
  return phase.hanSetup !== undefined && phase.choSetup !== undefined;
}
