import type {WithName} from "@src/react/pages/game/types/WithName";
import {clsx} from "clsx";
import {toSlug} from "@src/react/pages/game/components/settings/components/option-picker/utils/ToSlug";

/**
 * One option in a picker: its name, pressed when it is the one in use.
 *
 * The name is the button's whole text and nothing is drawn beside it, because the acceptance tests
 * read which option is pressed off that text.
 */
interface Props<Option extends WithName> {
  readonly pickerId: string;
  readonly option: Option;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly onSelect: (option: Option) => void;
}

export function OptionButton<Option extends WithName>({
  pickerId,
  option,
  selected,
  disabled,
  onSelect,
}: Props<Option>): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid={`${pickerId}-option-${toSlug(option.name)}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(option)}
      className={clsx(
        "min-w-fit flex-1 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none",
        selected ? "bg-wood text-ink shadow" : "text-white/70 enabled:hover:bg-white/10",
      )}
    >
      {option.name}
    </button>
  );
}
