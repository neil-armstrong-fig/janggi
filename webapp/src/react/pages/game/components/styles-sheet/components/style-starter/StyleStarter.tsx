import {SectionHeading} from "@src/react/pages/game/components/styles-sheet/components/section-heading/SectionHeading";
import {STYLE_KINDS} from "@janggi/shared/janggi/settings/StyleKind";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {EditingStyle} from "@src/react/pages/game/components/styles-sheet/types/EditingStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {useState} from "react";

/**
 * Where making a style of one's own begins: which kind, and which style the player already has to start
 * from, so what opens is always a style that works. Once their XP has unlocked it — before, it says what it
 * costs, and that importing a style never costs anything.
 */
interface Props {
  readonly unlocked: boolean;
  readonly price: number;
  /** The board styles a player may start from: every built-in they have unlocked, and their own. */
  readonly boardStyles: readonly BoardStyle[];
  readonly pieceSetStyles: readonly PieceSetStyle[];
  readonly onStart: (editingStyle: EditingStyle) => void;
}

export function StyleStarter({unlocked, price, boardStyles, pieceSetStyles, onStart}: Props): React.JSX.Element {
  const [kind, setKind] = useState<StyleKind>("Board");
  const [from, setFrom] = useState("");

  const startingPoints: readonly (BoardStyle | PieceSetStyle)[] = kind === "Board" ? boardStyles : pieceSetStyles;

  const start = (): void => {
    if (kind === "Board") {
      const boardStyle = boardStyles.find(candidateBoardStyle => candidateBoardStyle.name === from) ?? boardStyles[0];
      if (boardStyle) onStart({kind: "Board", from: boardStyle});
      return;
    }

    const pieceSetStyle =
      pieceSetStyles.find(candidatePieceSetStyle => candidatePieceSetStyle.name === from) ?? pieceSetStyles[0];
    if (pieceSetStyle) onStart({kind: "Pieces", from: pieceSetStyle});
  };

  return (
    <section aria-label="Make your own style" className="flex flex-col gap-2">
      <SectionHeading>Make your own</SectionHeading>

      {!unlocked && (
        <p data-testid="style-editor-locked" className="text-sm text-white/70">
          🔒 Making your own styles unlocks at {price.toLocaleString("en")} XP. Importing one somebody shared never
          costs anything.
        </p>
      )}

      {unlocked && (
        <>
          <p className="text-xs text-white/60">
            Start from a style you have, then change it on a board of its own — colours, lines, marks and pieces, all
            shown as you go — and save it under a name of your own.
          </p>

          <div className="flex gap-2">
            <select
              data-testid="style-editor-kind"
              aria-label="What kind of style to make"
              value={kind}
              onChange={event => {
                const chosen = STYLE_KINDS.find(candidate => candidate === event.target.value);
                if (chosen) {
                  setKind(chosen);
                  setFrom("");
                }
              }}
              className={FIELD}
            >
              {STYLE_KINDS.map(candidate => (
                <option key={candidate} value={candidate} className="bg-ground-raised">
                  {candidate}
                </option>
              ))}
            </select>

            <select
              data-testid="style-editor-from"
              aria-label="The style to start from"
              value={from || startingPoints[0]?.name}
              onChange={event => setFrom(event.target.value)}
              className={FIELD}
            >
              {startingPoints.map(style => (
                <option key={style.name} value={style.name} className="bg-ground-raised">
                  {style.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            data-testid="style-editor-start"
            onClick={start}
            className="h-11 cursor-pointer rounded-xl bg-wood text-sm font-semibold tracking-wide text-ink uppercase shadow transition-[transform,background-color] duration-150 hover:bg-wood/90 active:scale-[0.98] motion-reduce:transition-none"
          >
            Start
          </button>
        </>
      )}
    </section>
  );
}

const FIELD = "w-full rounded-xl bg-black/25 px-3 py-2.5 text-base text-white/90 placeholder:text-white/30";
