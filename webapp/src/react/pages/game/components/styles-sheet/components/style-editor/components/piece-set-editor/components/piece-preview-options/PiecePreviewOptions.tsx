import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {CompanionPicker} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/companion-picker/CompanionPicker";
import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {TargetBar} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/target-bar/TargetBar";
import {pieceTargetName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/PieceTargetName";

/**
 * What goes with the pieces' preview: the board to show them on, and what the controls are changing — one
 * army's pieces, or the one piece tapped — with the way to choose an army.
 */
interface Props {
  /** The boards the player has, which the pieces may be previewed on. */
  readonly boardStyles: readonly BoardStyle[];
  /** The name of the board previewed on, or an empty string for the current one. */
  readonly previewedOn: string;
  readonly onPreviewedOn: (name: string) => void;
  readonly pieceTarget: PieceTarget;
  /** Whether the piece being changed has a style of its own to take back. */
  readonly canReset: boolean;
  readonly onReset: () => void;
  readonly onSide: (side: Side) => void;
}

export function PiecePreviewOptions({
  boardStyles,
  previewedOn,
  onPreviewedOn,
  pieceTarget,
  canReset,
  onReset,
  onSide,
}: Props): React.JSX.Element {
  const messages = useMessages();
  const words = messages.styles.editor;
  return (
    <>
      <CompanionPicker
        label={words.previewOn}
        currentLabel={words.currentBoard}
        names={boardStyles.map(boardStyle => boardStyle.name)}
        value={previewedOn}
        onChange={onPreviewedOn}
      />

      <TargetBar
        name={pieceTargetName(pieceTarget, messages)}
        targetChoices={ARMIES.map(side => ({
          name: messages.sides[side],
          chosen: pieceTarget.kind === "side" && pieceTarget.side === side,
          onChoose: () => onSide(side),
        }))}
        canReset={canReset}
        onReset={onReset}
      />
    </>
  );
}

const ARMIES: readonly Side[] = ["han", "cho"];
