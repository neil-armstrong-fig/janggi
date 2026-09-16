import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";

/**
 * The four arrangements a scored game is laid out from — every setup but the Central Chariot, which is
 * casual play only. A scored game is the only one the bot ever lays out.
 */
export const TOURNAMENT_SETUPS: readonly Setup[] = SETUPS.filter(({name}) => name !== "Central Chariot");
