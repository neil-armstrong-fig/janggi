import type {WithName} from "@src/react/pages/game/types/WithName";
import {clsx} from "clsx";
import {toSlug} from "@src/react/pages/game/components/settings/components/option-picker/utils/ToSlug";

/**
 * One option in a picker: its name, pressed when it is the one in use.
 *
 * The name is the button's whole text and nothing is drawn beside it, because the acceptance tests
 * read which option is pressed off that text. A locked option is disabled and says why in its title
 * rather than in its text, for the same reason, and carries `data-locked` for a spec to read.
 */
interface Props<Option extends WithName> {
  readonly pickerId: string;
  readonly option: Option;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly lockedReason: string | undefined;
  readonly onSelect: (option: Option) => void;
}

export function OptionButton<Option extends WithName>({
  pickerId,
  option,
  selected,
  disabled,
  lockedReason,
  onSelect,
}: Props<Option>): React.JSX.Element {
  const locked = lockedReason !== undefined;

  return (
    <button
      type="button"
      data-testid={`${pickerId}-option-${toSlug(option.name)}`}
      data-locked={locked || undefined}
      aria-pressed={selected}
      disabled={disabled || locked}
      title={locked ? `Locked: ${lockedReason}` : undefined}
      onClick={() => onSelect(option)}
      className={clsx(
        "min-h-11 min-w-fit flex-1 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none",
        selected && "bg-wood text-ink shadow",
        !selected && "text-white/70 enabled:hover:bg-white/10",
      )}
    >
      {option.name}
    </button>
  );
}
