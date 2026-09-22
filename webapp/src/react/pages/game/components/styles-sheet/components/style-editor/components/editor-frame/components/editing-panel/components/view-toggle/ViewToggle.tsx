import {STYLE_VIEWS} from "@src/react/pages/game/components/styles-sheet/components/style-editor/types/StyleView";
import type {StyleView} from "@src/react/pages/game/components/styles-sheet/components/style-editor/types/StyleView";
import {clsx} from "clsx";

/** Whether a style is changed with the controls or as its raw JSON. */
interface Props {
  readonly styleView: StyleView;
  readonly onView: (styleView: StyleView) => void;
}

export function ViewToggle({styleView, onView}: Props): React.JSX.Element {
  return (
    <div role="group" aria-label="How to change the style" className="flex gap-1 rounded-lg bg-black/25 p-1">
      {STYLE_VIEWS.map(option => (
        <button
          key={option}
          type="button"
          data-testid={`style-editor-${option}`}
          aria-pressed={styleView === option}
          onClick={() => onView(option)}
          className={clsx(
            "h-8 flex-1 cursor-pointer rounded-md text-xs capitalize",
            styleView === option ? "bg-wood font-semibold text-ink" : "text-white/70 hover:bg-white/10",
          )}
        >
          {option === "raw" ? "Raw JSON" : "Controls"}
        </button>
      ))}
    </div>
  );
}
