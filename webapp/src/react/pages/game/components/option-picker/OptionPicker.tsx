import type {WithName} from "@src/react/pages/game/components/option-picker/types/WithName";
import {OptionButton} from "@src/react/pages/game/components/option-picker/components/option-button/OptionButton";

/**
 * Scaffolding for the prototype: somewhere to see that a board is nothing but the data its cells
 * and pieces are given. A real settings screen replaces it.
 *
 * Generic over anything with a name, because board styles, piece sets and opening setups are all
 * lists of named things and three near-identical pickers would be three places to fix a bug.
 */
interface Props<Option extends WithName> {
  /** Prefixes the `data-testid` of the picker and of every button in it. */
  readonly id: string;
  readonly label: string;
  /** Read out in place of the label, where the label alone is too terse to stand on its own. */
  readonly ariaLabel?: string;
  readonly options: readonly Option[];
  readonly selected: Option;
  /** A picker whose choice is no longer available — a setup, once play has begun. */
  readonly disabled?: boolean;
  readonly onSelect: (option: Option) => void;
}

export function OptionPicker<Option extends WithName>({
  id,
  label,
  ariaLabel,
  options,
  selected,
  disabled = false,
  onSelect,
}: Props<Option>): React.JSX.Element {
  return (
    <nav data-testid={`${id}-picker`} aria-label={ariaLabel ?? label} className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-right text-[11px] tracking-wide text-white/40 uppercase">{label}</span>

      {/* Five setups will not fit across a phone, so the row scrolls rather than wrapping and
          pushing the board out of the viewport. */}
      <div className="flex flex-1 gap-1.5 overflow-x-auto">
        {options.map(option => (
          <OptionButton
            key={option.name}
            pickerId={id}
            option={option}
            selected={option.name === selected.name}
            disabled={disabled}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}
