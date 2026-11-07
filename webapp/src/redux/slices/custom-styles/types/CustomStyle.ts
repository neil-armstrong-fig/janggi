import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";

/**
 * One of the player's own styles, whichever kind it is.
 *
 * The two kinds are kept in their own lists and never mixed, but *how* a style joins a list — the name it
 * ends up under, whether it replaces one already there — is the same for both, so the rules in `joining/`
 * are written once against this.
 */
export type CustomStyle = BoardStyle | PieceSetStyle;
