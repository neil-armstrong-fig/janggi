import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import {CompanionPicker} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/companion-picker/CompanionPicker";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {SceneName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/SceneName";
import {SceneSwitcher} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/scene-switcher/SceneSwitcher";
import {TargetBar} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/target-bar/TargetBar";
import {boardTargetName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/BoardTargetName";

/**
 * What goes with the board's preview: the pieces to show it with, the position to show it in, and what the
 * controls are changing — every point, or the one tapped — with the way back to every point.
 */
interface Props {
  /** The piece sets the player has, which the board may be previewed with. */
  readonly pieceSetStyles: readonly PieceSetStyle[];
  /** The name of the piece set previewed with, or an empty string for the current one. */
  readonly previewedWith: string;
  readonly onPreviewedWith: (name: string) => void;
  readonly sceneName: SceneName;
  readonly onScene: (sceneName: SceneName) => void;
  readonly boardTarget: BoardTarget;
  /** Whether the point being changed has a style of its own to take back. */
  readonly canReset: boolean;
  readonly onReset: () => void;
  readonly onEveryPoint: () => void;
}

export function BoardPreviewOptions({
  pieceSetStyles,
  previewedWith,
  onPreviewedWith,
  sceneName,
  onScene,
  boardTarget,
  canReset,
  onReset,
  onEveryPoint,
}: Props): React.JSX.Element {
  return (
    <>
      <CompanionPicker
        label="Preview with"
        currentLabel="Current pieces"
        names={pieceSetStyles.map(pieceSetStyle => pieceSetStyle.name)}
        value={previewedWith}
        onChange={onPreviewedWith}
      />

      <SceneSwitcher value={sceneName} onChange={onScene} />

      <TargetBar
        name={boardTargetName(boardTarget)}
        targetChoices={
          boardTarget.kind === "point" ? [{name: "Every point", chosen: false, onChoose: onEveryPoint}] : []
        }
        canReset={canReset}
        onReset={onReset}
      />
    </>
  );
}
