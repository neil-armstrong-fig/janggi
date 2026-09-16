import {ShareKey} from "@src/react/pages/game/components/settings/components/progress/components/share-key/ShareKey";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";

/**
 * One of the player's own styles: its name and kind, a key to share it by, and a way to delete it. The
 * row carries `data-kind` and `data-name` so a spec can find a style the way a player would.
 */
interface Props {
  readonly kind: StyleKind;
  readonly name: string;
  readonly keyOf: () => string;
  readonly onDelete: () => void;
}

export function CustomStyleRow({kind, name, keyOf, onDelete}: Props): React.JSX.Element {
  return (
    <li
      data-testid="custom-style"
      data-kind={kind}
      data-name={name}
      className="flex flex-col gap-2 rounded-xl bg-black/25 p-3"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-sm font-semibold text-white/90">{name}</span>

        <span className="shrink-0 text-xs text-white/50 uppercase">{kind}</span>
      </div>

      <ShareKey id="custom-style" label="Copy key" keyOf={keyOf} />

      <button
        type="button"
        data-testid="custom-style-delete"
        onClick={onDelete}
        className="h-9 cursor-pointer rounded-lg text-sm font-medium text-danger hover:bg-white/10"
      >
        Delete
      </button>
    </li>
  );
}
