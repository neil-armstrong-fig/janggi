import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";

/**
 * A piece set that ships with the app.
 *
 * The only difference from a set someone writes themselves is the name: a built-in must be called
 * one of the names `@janggi/shared` publishes, which is what makes the acceptance tests able to ask
 * for one by name and fail to compile if it is renamed or dropped. A user-authored set stays a
 * plain `PieceSetStyle` and may be called anything.
 */
export interface BuiltInPieceSetStyle extends PieceSetStyle {
  readonly name: PieceSetName;
}
