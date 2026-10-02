/** How a write of the player's data ended: kept, or refused because somebody else had written since. */
export type DataWriteOutcome = "written" | "conflict";
