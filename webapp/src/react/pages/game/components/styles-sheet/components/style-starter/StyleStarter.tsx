import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {Button} from "@src/react/pages/game/components/button/Button";
import {SelectField} from "@src/react/pages/game/components/select-field/SelectField";
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
  const messages = useMessages();
  const words = messages.styles.starter;
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
    <section aria-label={words.label} className="flex flex-col gap-2">
      <SectionHeading>{words.heading}</SectionHeading>

      {!unlocked && (
        <p data-testid="style-editor-locked" className="text-sm text-white/70">
          {words.locked(price.toLocaleString(messages.locale))}
        </p>
      )}

      {unlocked && (
        <>
          <p className="text-xs text-white/60">{words.note}</p>

          <div className="flex gap-2">
            <SelectField
              wrapperClassName="w-full"
              data-testid="style-editor-kind"
              aria-label={words.kindLabel}
              value={kind}
              onChange={event => {
                const chosen = STYLE_KINDS.find(candidate => candidate === event.target.value);
                if (chosen) {
                  setKind(chosen);
                  setFrom("");
                }
              }}
              className="py-2.5 text-base"
            >
              {STYLE_KINDS.map(candidate => (
                <option key={candidate} value={candidate} className="bg-ground-raised">
                  {messages.styles.kinds[candidate]}
                </option>
              ))}
            </SelectField>

            <SelectField
              wrapperClassName="w-full"
              data-testid="style-editor-from"
              aria-label={words.fromLabel}
              value={from || startingPoints[0]?.name}
              onChange={event => setFrom(event.target.value)}
              className="py-2.5 text-base"
            >
              {startingPoints.map(style => (
                <option key={style.name} value={style.name} className="bg-ground-raised">
                  {style.name}
                </option>
              ))}
            </SelectField>
          </div>

          <Button variant="primary" data-testid="style-editor-start" onClick={start}>
            {words.start}
          </Button>
        </>
      )}
    </section>
  );
}
