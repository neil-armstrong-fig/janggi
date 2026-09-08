import {CharacterGlyph} from "@src/react/pages/game/components/board/components/piece/components/character-glyph/CharacterGlyph";
import {PIECE_SVG_PROPS} from "@src/react/pages/game/components/board/components/piece/utils/PieceViewBox";
import {PieceBody} from "@src/react/pages/game/components/board/components/piece/components/piece-body/PieceBody";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import {Pictograph} from "@src/react/pages/game/components/board/components/piece/components/pictograph/Pictograph";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import {characterFor} from "@src/react/pages/game/components/board/components/piece/utils/CharacterFor";
import {pieceName} from "@src/react/pages/game/components/board/components/piece/utils/PieceNames";
import {resolvePieceStyle} from "@src/react/pages/game/components/board/components/piece/utils/ResolvePieceStyle";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/**
 * One piece, laid over the intersection it stands on. The only thing that knows how to turn a
 * `PieceStyle` into pixels, which is what lets a set be plain data a user can author.
 *
 * It draws in its own square rather than in the cell's `<svg>`, because a cell is stretched to fill
 * a board wider than it is tall and a piece that went along with that would be an ellipse. It is
 * also inert: there is no game logic yet, and a piece that swallowed taps would only be in the way.
 *
 * Looking a mark up is done here rather than inside the glyph components, so each of those is
 * handed the one character or one drawing it has to paint and needs to know nothing else.
 */
interface Props {
  readonly piece: PieceIdentity;
  readonly style: PieceSetStyle;
}

export function Piece({piece, style}: Props): React.JSX.Element {
  const pieceStyle = resolvePieceStyle(style, piece);
  const glyph = pieceStyle.glyph;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg
        {...PIECE_SVG_PROPS}
        data-testid="piece"
        data-piece={toPieceKey(piece)}
        role="img"
        aria-label={pieceName(piece)}
        style={{height: `${pieceStyle.size * 100}%`, aspectRatio: 1}}
      >
        <PieceBody body={pieceStyle.body} />

        {glyph.kind === "character" && (
          <CharacterGlyph character={characterFor(glyph.characters, piece)} glyph={glyph} />
        )}

        {glyph.kind === "pictograph" && <Pictograph path={glyph.pictographs[piece.type]} glyph={glyph} />}
      </svg>
    </div>
  );
}
