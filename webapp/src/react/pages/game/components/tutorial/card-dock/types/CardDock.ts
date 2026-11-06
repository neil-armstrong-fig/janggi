import {BOARD_EDGES} from "@src/react/pages/game/components/tutorial/card-dock/types/BoardEdge";

/**
 * Where the tutorial's card stands: against the top of the screen, at the bottom above the row of controls, or lowest,
 * over the controls — only for words about Han's side that leave nowhere else clear, Settings then being under it.
 */
export const CARD_DOCKS = [...BOARD_EDGES, "lowest"] as const;

export type CardDock = (typeof CARD_DOCKS)[number];
