import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The piece set each army is drawn in — the same one for both, unless the player has chosen otherwise. */
export type ArmyPieceSets = Readonly<Record<Side, PieceSetStyle>>;
