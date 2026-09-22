import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";

/** A style as the raw view shows it: its JSON, without the name, which has a box of its own. */
export function writtenOut(style: BoardStyle | PieceSetStyle): string {
  return JSON.stringify({...style, name: undefined}, null, 2);
}
