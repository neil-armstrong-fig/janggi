import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import type {SheetName} from "@src/redux/settings/types/SheetName";

/**
 * Which sheet is up over the game, if any, and which tab the settings sheet is turned to. Not the player's
 * preferences — those are `state.preferences` — but where they are chosen: several sections open, close and
 * turn the sheets (the button under the board, the sheets themselves, the tour), so it is a slice, and it is
 * not kept, since a page opens with no sheet up. The tab is not put back to the first when the sheet closes.
 */
export interface SettingsSliceState {
  readonly openSheet: SheetName | undefined;
  readonly tab: SettingsTabName;
}
