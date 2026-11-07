import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";

/**
 * A side chosen, and the army it came to. The two differ only for Random, which is rolled when the
 * action is created — a reducer may not roll dice, or replaying the same actions would deal a
 * different game.
 */
export interface SettledSideChoice {
  readonly choice: SideChoiceName;
  readonly side: Side;
}
