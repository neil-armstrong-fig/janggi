import {CharacterGlyph} from "@src/react/pages/game/components/board/components/piece/components/character-glyph/CharacterGlyph";
import type {Flourish} from "@src/react/pages/game/components/board/types/Flourish";
import type {FlourishKind} from "@src/react/pages/game/components/board/types/FlourishKind";
import {PIECE_SVG_PROPS} from "@src/react/pages/game/components/board/components/piece/utils/PieceViewBox";
import {PieceBody} from "@src/react/pages/game/components/board/components/piece/components/piece-body/PieceBody";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceLift} from "@src/react/pages/game/components/board/types/PieceLift";
import {Pictograph} from "@src/react/pages/game/components/board/components/piece/components/pictograph/Pictograph";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {characterFor} from "@src/react/pages/game/components/board/components/piece/utils/CharacterFor";
import {pieceName} from "@src/react/pages/game/components/board/components/piece/utils/PieceNames";
import {resolvePieceStyle} from "@src/react/pages/game/components/board/components/piece/utils/ResolvePieceStyle";
import {clsx} from "clsx";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/**
 * One piece, laid over the intersection it stands on. The only thing that knows how to turn a
 * `PieceStyle` into pixels, which is what lets a set be plain data a user can author.
 *
 * It draws in its own square rather than in the cell's `<svg>`, because a cell is stretched to fill
 * a board wider than it is tall and a piece that went along with that would be an ellipse. It is
 * also inert, so a tap falls through it to the cell it stands in.
 *
 * Looking a mark up is done here rather than inside the glyph components, so each of those is
 * handed the one character or one drawing it has to paint and needs to know nothing else.
 *
 * **Three layers wrap the drawing, one job each**, so no motion undoes another: the outermost hides a
 * piece whose flight is still being shown; the middle plays a flourish — dropped into place as a game
 * is set out, lifted and put back as its army rests a turn; the innermost lifts the piece while it is
 * in hand. A lift is eased in and out, and a flourish is replayed each time it is handed a new one.
 */
interface Props {
  readonly piece: PieceIdentity;
  readonly style: PieceSetStyle;
  /** Drawn with a heavier outline, to answer the pointer resting on it. */
  readonly emphasised: boolean;
  /**
   * Still here, and still what the board says stands on its point, but not drawn — while a copy of it
   * is shown flying in over the board, so the piece does not arrive before its own flight does.
   */
  readonly concealed?: boolean;
  readonly lift?: PieceLift;
  readonly flourish?: Flourish;
}

export function Piece({
  piece,
  style,
  emphasised,
  concealed = false,
  lift = "resting",
  flourish,
}: Props): React.JSX.Element {
  const pieceStyle = resolvePieceStyle(style, piece);
  const glyph = pieceStyle.glyph;

  return (
    <div className={clsx("pointer-events-none absolute inset-0", concealed && "opacity-0")}>
      <div
        className={clsx("absolute inset-0", flourish && FLOURISHES[flourish.kind])}
        style={flourish ? {animationDelay: `${flourish.delay}ms`} : undefined}
      >
        <div
          className={clsx(
            "absolute inset-0 flex items-center justify-center transition-[scale,translate,filter] duration-150 ease-out motion-reduce:transition-none",
            LIFTS[lift],
          )}
          style={lift === "held" ? {filter: `drop-shadow(0 5px 4px ${style.handling.shadow})`} : undefined}
        >
          <svg
            {...PIECE_SVG_PROPS}
            data-testid="piece"
            data-piece={toPieceKey(piece)}
            role="img"
            className="group-data-[flipped=true]/flip:rotate-180"
            aria-label={pieceName(piece)}
            style={{height: `${pieceStyle.size * 100}%`, aspectRatio: 1}}
          >
            <PieceBody body={pieceStyle.body} strokeScale={emphasised ? style.handling.hoverOutline : 1} />

            {glyph.kind === "character" && (
              <CharacterGlyph character={characterFor(glyph.characters, piece)} glyph={glyph} />
            )}

            {glyph.kind === "pictograph" && <Pictograph path={glyph.pictographs[piece.type]} glyph={glyph} />}
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Nudged up under a pointer, and lifted clean off the board while in hand — its shadow is the set's own. */
const LIFTS: Record<PieceLift, string> = {
  resting: "",
  hovered: "-translate-y-[3%]",
  held: "scale-110",
};

const FLOURISHES: Record<FlourishKind, string> = {
  dealt: "animate-[deal-drop_440ms_cubic-bezier(0.3,1.3,0.5,1)_both]",
  rested: "animate-[piece-rest_620ms_ease-in-out_both]",
};
