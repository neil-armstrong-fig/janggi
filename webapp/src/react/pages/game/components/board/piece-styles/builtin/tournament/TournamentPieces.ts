import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {MODERN_SANS} from "@src/react/pages/game/components/board/piece-styles/builtin/utils/ModernSet";
import {HANJA_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HanjaCharacters";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/** The two colours the club's plastic sets come in — the army's colour moulded into rim and word. */
const COLOURS: Record<Side, string> = {
  han: "#c62828",
  cho: "#1565c0",
};

/**
 * Wide enough to read as moulded, and narrow enough that the pointer's heavier stroke still fits the box.
 *
 * These three sit above the set rather than at the foot of the file, where a plain constant usually goes,
 * because the set is built as the module loads: a `const` further down would not exist yet when `plastic`
 * reached for it, and importing the set would throw.
 */
const RIM = 3;

/** A shade smaller than the modern sets, so a rim this heavy does not crowd its neighbours. */
const STANDARD_SIZE = 0.82;
const GENERAL_SIZE = 0.9;

/**
 * The club set: cream plastic discs with the army's colour moulded into the rim and the character, the
 * hanja a tournament board is actually played with — what a roll-up vinyl board at a club is played with,
 * and a set that has survived being dropped a hundred times.
 *
 * Cho is blue here rather than green: a club set is made to be told apart at a glance across a hall,
 * not to match the book.
 *
 * **Its rim is thinner than it looks like it should be, and the pieces sit a little inside the cell.** A
 * piece is drawn at radius 46 of a 100-wide box, and a piece under the pointer has its stroke multiplied
 * (the set's `handling.hoverOutline`) — a 5-wide rim became 11 and put the outer edge past the box, which clipped
 * it flat at top, bottom and both sides. Three leaves room for that, and the smaller sizes leave room for
 * the moulded look without crowding the point the piece stands on.
 */
export const tournamentPieces: BuiltInPieceSetStyle = {
  name: "Tournament",
  handling: DEFAULT_PIECE_HANDLING,
  sides: {
    han: plastic("han", STANDARD_SIZE),
    cho: plastic("cho", STANDARD_SIZE),
  },
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: plastic("han", GENERAL_SIZE),
    [toPieceKey({side: "cho", type: "general"})]: plastic("cho", GENERAL_SIZE),
  },
};

function plastic(side: Side, size: number): PieceStyle {
  return {
    body: {
      shape: "disc",
      fill: "#fbf8ef",
      stroke: COLOURS[side],
      strokeWidth: RIM,
      inlay: {inset: 0.2, stroke: COLOURS[side], strokeWidth: 1.5},
    },
    glyph: {
      kind: "character",
      characters: HANJA_CHARACTERS,
      colour: COLOURS[side],
      scale: 0.46,
      fontFamily: MODERN_SANS,
      fontWeight: 800,
    },
    size,
  };
}
