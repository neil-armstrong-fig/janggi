import {STYLE_KINDS} from "@janggi/shared/janggi/settings/StyleKind";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PasteResult} from "@src/react/pages/game/components/settings/components/progress/components/paste-key/types/PasteResult";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {clsx} from "clsx";
import {editedStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/edited-style/EditedStyle";
import {useState} from "react";

/**
 * Where a player makes a style of their own, once their XP has unlocked it: pick a board style or piece
 * set they already have to start from, rename it, change its JSON, and save. The schema is the one every
 * built-in is written in, so the JSON a player starts from is a working example of every field.
 *
 * A code box rather than colour pickers, deliberately — it is the whole schema at once, it needs nothing
 * built for each field, and a player who wants to hand-write a gradient can. What it saves is checked
 * exactly as an imported style is, and the reason shown under it if it is refused.
 *
 * Before the unlock, it says what it costs and that importing a style never costs anything.
 */
interface Props {
  readonly unlocked: boolean;
  readonly price: number;
  /** The board styles a player may start from: every built-in they have unlocked, and their own. */
  readonly boards: readonly BoardStyle[];
  readonly pieceSets: readonly PieceSetStyle[];
  readonly onSaveBoard: (style: BoardStyle) => void;
  readonly onSavePieces: (set: PieceSetStyle) => void;
}

export function StyleEditor({unlocked, price, boards, pieceSets, onSaveBoard, onSavePieces}: Props): React.JSX.Element {
  const [kind, setKind] = useState<StyleKind>("Board");
  const [from, setFrom] = useState(boards[0]?.name ?? "");
  const [name, setName] = useState("");
  const [json, setJson] = useState(() => writtenOut(boards[0]));
  const [result, setResult] = useState<PasteResult | undefined>(undefined);

  const startingPoints: readonly (BoardStyle | PieceSetStyle)[] = kind === "Board" ? boards : pieceSets;

  const startFrom = (nextKind: StyleKind, nextFrom: string): void => {
    const styles: readonly (BoardStyle | PieceSetStyle)[] = nextKind === "Board" ? boards : pieceSets;
    const style = styles.find(candidate => candidate.name === nextFrom) ?? styles[0];

    setKind(nextKind);
    setFrom(style?.name ?? "");
    setJson(writtenOut(style));
    setResult(undefined);
  };

  const save = (): void => {
    const outcome = editedStyle(kind, name, json);

    switch (outcome.kind) {
      case "board":
        onSaveBoard(outcome.style);
        setResult({accepted: true, message: `Saved "${outcome.style.name}", and the board is wearing it.`});
        return;
      case "pieces":
        onSavePieces(outcome.style);
        setResult({accepted: true, message: `Saved "${outcome.style.name}", and the board is wearing it.`});
        return;
      case "refused":
        setResult({accepted: false, message: outcome.reason});
    }
  };

  return (
    <section aria-label="Make your own style" className="flex flex-col gap-2">
      <h3 className="border-b border-white/10 pb-1 text-xs font-semibold tracking-wide text-white/40 uppercase">
        Make your own
      </h3>

      {!unlocked && (
        <p data-testid="style-editor-locked" className="text-sm text-white/70">
          🔒 Making your own styles unlocks at {price.toLocaleString("en")} XP. Importing one somebody shared never
          costs anything.
        </p>
      )}

      {unlocked && (
        <>
          <p className="text-xs text-white/60">
            Start from a style you have, change its JSON, and save it under a name of your own. Colours may be any CSS
            colour or gradient, but nothing may be loaded from anywhere else.
          </p>

          <div className="flex gap-2">
            <select
              data-testid="style-editor-kind"
              aria-label="What kind of style to make"
              value={kind}
              onChange={event => {
                const chosen = STYLE_KINDS.find(candidate => candidate === event.target.value);
                if (chosen) startFrom(chosen, "");
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
              value={from}
              onChange={event => startFrom(kind, event.target.value)}
              className={FIELD}
            >
              {startingPoints.map(style => (
                <option key={style.name} value={style.name} className="bg-ground-raised">
                  {style.name}
                </option>
              ))}
            </select>
          </div>

          <input
            data-testid="style-editor-name"
            aria-label="A name for your style"
            placeholder="A name for your style"
            value={name}
            maxLength={40}
            onChange={event => {
              setName(event.target.value);
              setResult(undefined);
            }}
            className={FIELD}
          />

          <textarea
            data-testid="style-editor-json"
            aria-label="Your style, as JSON"
            value={json}
            rows={12}
            spellCheck={false}
            onChange={event => {
              setJson(event.target.value);
              setResult(undefined);
            }}
            className="w-full rounded-xl bg-black/25 px-3 py-2 font-mono text-base leading-snug text-white/90"
          />

          <button
            type="button"
            data-testid="style-editor-save"
            onClick={save}
            className="h-11 cursor-pointer rounded-xl bg-wood text-sm font-semibold tracking-wide text-ink uppercase shadow transition-[transform,background-color] duration-150 hover:bg-wood/90 active:scale-[0.98] motion-reduce:transition-none"
          >
            Save style
          </button>

          {result && (
            <p
              data-testid="style-editor-message"
              data-accepted={result.accepted}
              role="status"
              className={clsx("text-xs break-words", result.accepted ? "text-cho" : "text-danger")}
            >
              {result.message}
            </p>
          )}
        </>
      )}
    </section>
  );
}

/** A style as the editor shows it: its JSON, without the name, which has a box of its own. */
function writtenOut(style: BoardStyle | PieceSetStyle | undefined): string {
  return style === undefined ? "{}" : JSON.stringify({...style, name: undefined}, null, 2);
}

const FIELD = "w-full rounded-xl bg-black/25 px-3 py-2.5 text-base text-white/90 placeholder:text-white/30";
