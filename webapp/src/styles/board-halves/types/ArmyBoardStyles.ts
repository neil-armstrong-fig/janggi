import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The board each army is drawn on — the same one for both, unless the player has chosen otherwise. */
export type ArmyBoardStyles = Readonly<Record<Side, BoardStyle>>;
