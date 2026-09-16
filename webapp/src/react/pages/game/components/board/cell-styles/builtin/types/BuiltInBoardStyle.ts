import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";

/**
 * A board style that ships with the app. Named from the union `@janggi/shared` publishes, so a
 * built-in that is renamed or dropped breaks the acceptance tests at compile time rather than at
 * three in the morning. A user-authored style stays a plain `BoardStyle` and may be called anything.
 */
export interface BuiltInBoardStyle extends BoardStyle {
  readonly name: BoardStyleName;
}
