import {DEFAULT_SETUP, SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";

/**
 * One of the four tournament arrangements, picked by `roll` — a number in [0, 1), as `Math.random`
 * gives one.
 *
 * The fifth is casual play only, and a scored game is the only one the bot ever lays out.
 */
export function tournamentSetupFor(roll: number): Setup {
  return TOURNAMENT_SETUPS[Math.floor(roll * TOURNAMENT_SETUPS.length)] ?? DEFAULT_SETUP;
}

const TOURNAMENT_SETUPS: readonly Setup[] = SETUPS.filter(({name}) => name !== "Central Chariot");
