import type {TargetChoice} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/target-bar/types/TargetChoice";
import {clsx} from "clsx";

/**
 * What the controls are changing, said plainly, with the way to change it: buttons for the whole thing —
 * an army, every point — and, once one point or piece has been tapped on the preview to give it a style
 * of its own, a button to take that back. Tapping the preview is how a single point or piece is chosen.
 */
interface Props {
  /** What the controls are changing now. */
  readonly name: string;
  readonly targetChoices: readonly TargetChoice[];
  /** Whether what is being changed has a style of its own to take back. */
  readonly canReset: boolean;
  readonly onReset: () => void;
}

export function TargetBar({name, targetChoices, canReset, onReset}: Props): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-white/60">Changing</span>

      <span
        data-testid="style-editor-target"
        className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-wood"
      >
        {name}
      </span>

      <div role="group" aria-label="Change all of" className="flex gap-1">
        {targetChoices.map(targetChoice => (
          <button
            key={targetChoice.name}
            type="button"
            aria-pressed={targetChoice.chosen}
            onClick={targetChoice.onChoose}
            className={clsx(
              "h-7 cursor-pointer rounded-md px-2 text-xs",
              targetChoice.chosen ? "bg-wood font-semibold text-ink" : "bg-black/25 text-white/70 hover:bg-white/10",
            )}
          >
            {targetChoice.name}
          </button>
        ))}
      </div>

      {canReset && (
        <button
          type="button"
          data-testid="style-editor-target-reset"
          onClick={onReset}
          className="h-7 cursor-pointer rounded-md bg-danger/20 px-2 text-xs text-danger hover:bg-danger/30"
        >
          Reset
        </button>
      )}
    </div>
  );
}
