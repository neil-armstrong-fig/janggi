import type {SceneName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/SceneName";
import {SCENE_NAMES} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/SceneName";
import {clsx} from "clsx";

/** Which position the preview shows the style in — the opening, a piece in hand, a check, a bikjang. */
interface Props {
  readonly value: SceneName;
  readonly onChange: (sceneName: SceneName) => void;
}

export function SceneSwitcher({value, onChange}: Props): React.JSX.Element {
  return (
    <div role="group" aria-label="Show the style in" className="flex gap-1 rounded-lg bg-black/25 p-1">
      {SCENE_NAMES.map(name => (
        <button
          key={name}
          type="button"
          data-testid={`style-preview-scene-${name}`}
          aria-pressed={value === name}
          onClick={() => onChange(name)}
          className={clsx(
            "h-8 min-w-0 flex-1 cursor-pointer rounded-md px-1 text-xs capitalize transition-colors duration-150 motion-reduce:transition-none",
            value === name && "bg-wood font-semibold text-ink",
            value !== name && "text-white/70 hover:bg-white/10",
          )}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
