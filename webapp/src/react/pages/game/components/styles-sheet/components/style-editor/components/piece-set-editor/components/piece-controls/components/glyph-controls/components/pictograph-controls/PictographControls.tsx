import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";
import type {DrawingRefusals} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/types/DrawingRefusals";
import type {PictographGlyphStyle} from "@src/styles/types/PieceStyle";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {pictographFromSvg} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/PictographFromSvg";
import {useState} from "react";
import {withPictograph} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/pictograph/WithPictograph";

/**
 * The drawing on each kind of piece, with a way to replace it with one of the player's own: an SVG file,
 * fitted to the piece. A drawing that will not do says why beside the piece it was for, and nothing is
 * changed. The files are read here, in the page, and go nowhere.
 */
interface Props {
  readonly pictographGlyphStyle: PictographGlyphStyle;
  readonly onChange: (update: (pictographGlyphStyle: PictographGlyphStyle) => PictographGlyphStyle) => void;
}

export function PictographControls({pictographGlyphStyle, onChange}: Props): React.JSX.Element {
  const {pieces: words, refusals: refusalWords} = useMessages().styles;
  const [refusals, setRefusals] = useState<DrawingRefusals>({});

  const importDrawing = async (pieceType: PieceType, file: File | undefined): Promise<void> => {
    if (!file) return;

    const refused = (reason: string): void => setRefusals(current => ({...current, [pieceType]: reason}));
    if (file.size > LARGEST_FILE) return refused(words.fileTooBig);

    const drawing = pictographFromSvg(await file.text(), refusalWords);
    if (drawing.kind === "refused") return refused(drawing.reason);

    setRefusals(current => ({...current, [pieceType]: undefined}));
    onChange(currentPictographGlyphStyle => withPictograph(currentPictographGlyphStyle, pieceType, drawing.value));
  };

  return (
    <ControlGroup title={words.drawings}>
      <p className="text-xs text-white/60">{words.drawingsNote}</p>

      {PIECE_TYPES.map(type => (
        <div key={type} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-28 shrink-0 text-xs text-white/70">{words.pieceTypes[type]}</span>

            <svg viewBox="0 0 100 100" aria-hidden className="h-10 w-10 shrink-0 rounded-lg bg-white/15">
              <path d={pictographGlyphStyle.pictographs[type]} fill={pictographGlyphStyle.colour} fillRule="nonzero" />
            </svg>

            <label className="flex h-9 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg bg-white/10 px-2 text-xs text-white/80 hover:bg-white/15">
              {words.chooseSvg}
              <input
                type="file"
                accept=".svg,image/svg+xml"
                data-testid={`style-control-pictograph-${type}`}
                aria-label={words.drawingFor(type)}
                onChange={event => {
                  void importDrawing(type, event.target.files?.[0]);
                  event.target.value = "";
                }}
                className="sr-only"
              />
            </label>
          </div>

          {refusals[type] && (
            <p data-testid={`style-control-pictograph-${type}-message`} role="status" className="text-xs text-danger">
              {refusals[type]}
            </p>
          )}
        </div>
      ))}
    </ControlGroup>
  );
}

/** Far more than any drawing of a piece takes, and a limit on what is read into the page. */
const LARGEST_FILE = 200_000;
