import type {DataWriteOutcome} from "@src/database/types/DataWriteOutcome";
import type {PlayerData} from "@src/database/types/PlayerData";

/** What came of a write of the player's data: kept, or refused because somebody else had written since. */
export interface DataWrite {
  readonly outcome: DataWriteOutcome;
  /** The version now held — the new one where written, the one that was in the way where not. */
  readonly version: PlayerData["version"];
}
