import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {HANJA_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HanjaCharacters";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

const SERIF = "'Nanum Myeongjo', 'Noto Serif KR', 'Source Han Serif KR', 'Songti SC', 'SimSun', serif";

/** Lacquer in each army's colour — a palace red for Han, the blue-green of the painted eaves for Cho. */
const LACQUER: Record<Side, string> = {
  han: "#8c1c13",
  cho: "#1d5c7a",
};

/**
 * Lacquered octagons edged and lettered in gold, the palace's own paintwork turned into a set: the hanja
 * a court would have cut, gilded, and a gold bevel inside the rim.
 */
export const dancheongPieces: BuiltInPieceSetStyle = {
  name: "Dancheong",
  handling: DEFAULT_PIECE_HANDLING,
  sides: {
    han: lacquered("han", 0.82),
    cho: lacquered("cho", 0.82),
  },
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: lacquered("han", 0.94),
    [toPieceKey({side: "cho", type: "general"})]: lacquered("cho", 0.94),
    [toPieceKey({side: "han", type: "soldier"})]: lacquered("han", 0.72),
    [toPieceKey({side: "cho", type: "soldier"})]: lacquered("cho", 0.72),
    [toPieceKey({side: "han", type: "guard"})]: lacquered("han", 0.72),
    [toPieceKey({side: "cho", type: "guard"})]: lacquered("cho", 0.72),
  },
};

function lacquered(side: Side, size: number): PieceStyle {
  return {
    body: {
      shape: "octagon",
      fill: LACQUER[side],
      stroke: "#f2c14e",
      strokeWidth: 3,
      inlay: {inset: 0.15, stroke: "#f2c14e", strokeWidth: 1.2},
    },
    glyph: {
      kind: "character",
      characters: HANJA_CHARACTERS,
      colour: "#f7d774",
      scale: 0.5,
      fontFamily: SERIF,
      fontWeight: 700,
    },
    size,
  };
}
