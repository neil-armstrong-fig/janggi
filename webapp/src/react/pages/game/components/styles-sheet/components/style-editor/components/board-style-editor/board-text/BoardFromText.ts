import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import {boardStyleFrom} from "@src/redux/custom-styles/untrusted/BoardStyleFrom";
import {objectFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/style-text/ObjectFromText";

/**
 * The board style in the raw view's text, checked exactly as an imported one is. The text has no name —
 * that has a box of its own — so the style is read under a stand-in, which the editor never shows.
 */
export function boardFromText(text: string): Checked<BoardStyle> {
  const written = objectFromText(text);

  return written.kind === "accepted" ? boardStyleFrom({...written.value, name: STAND_IN}) : written;
}

const STAND_IN = "Draft";
