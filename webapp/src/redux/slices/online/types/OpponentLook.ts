import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";

/**
 * The friend across the board, as the room introduced them: the name they gave, and — where they sent one and it checked
 * out, and not otherwise — the board and piece set they play on. The keys are the friend's own say-so, so they are
 * read like anything pasted in (`opponent-look/OpponentLookFrom.ts`) and only what passes is kept.
 */
export interface OpponentLook {
  readonly displayName: string;
  readonly boardStyle?: BoardStyle;
  readonly pieceSet?: PieceSetStyle;
}
