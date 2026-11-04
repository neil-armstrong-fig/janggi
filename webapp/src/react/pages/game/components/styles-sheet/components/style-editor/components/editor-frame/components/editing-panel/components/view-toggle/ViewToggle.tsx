import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {STYLE_VIEWS} from "@janggi/shared/janggi/styles/StyleView";
import type {StyleView} from "@janggi/shared/janggi/styles/StyleView";
import {clsx} from "clsx";

/** Whether a style is changed with the controls or as its raw JSON. */
interface Props {
  readonly styleView: StyleView;
  readonly onView: (styleView: StyleView) => void;
}

export function ViewToggle({styleView, onView}: Props): React.JSX.Element {
  const words = useMessages().styles.editor;
  return (
    <div role="group" aria-label={words.viewsLabel} className="flex gap-1 rounded-lg bg-black/25 p-1">
      {STYLE_VIEWS.map(option => (
        <button
          key={option}
          type="button"
          data-testid={`style-editor-${option}`}
          aria-pressed={styleView === option}
          onClick={() => onView(option)}
          className={clsx(
            "h-8 flex-1 cursor-pointer rounded-md text-xs capitalize",
            styleView === option && "bg-wood font-semibold text-ink",
            styleView !== option && "text-white/70 hover:bg-white/10",
          )}
        >
          {words.views[option]}
        </button>
      ))}
    </div>
  );
}
