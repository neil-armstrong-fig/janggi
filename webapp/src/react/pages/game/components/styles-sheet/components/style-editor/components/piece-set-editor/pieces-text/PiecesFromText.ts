import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {objectFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/style-text/ObjectFromText";
import {pieceSetStyleFrom} from "@src/redux/custom-styles/untrusted/PieceSetStyleFrom";

/** The piece set in the raw view's text, as `boardFromText` reads a board: checked as an import is, name aside. */
export function piecesFromText(text: string): Checked<PieceSetStyle> {
  const written = objectFromText(text);

  return written.kind === "accepted" ? pieceSetStyleFrom({...written.value, name: STAND_IN}) : written;
}

const STAND_IN = "Draft";
