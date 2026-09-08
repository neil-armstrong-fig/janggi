import type {WithName} from "@src/react/pages/game/components/option-picker/types/WithName";
import {toSlug} from "@src/react/pages/game/components/option-picker/components/option-button/utils/ToSlug";

/** One option in a picker: its name, pressed when it is the one in use. */
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
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
        disabled ? "" : "cursor-pointer"
      } ${selected ? "bg-[#e7c88f] text-[#1c140b]" : "bg-white/10 text-white/70"}`}
    >
      {option.name}
    </button>
  );
}
