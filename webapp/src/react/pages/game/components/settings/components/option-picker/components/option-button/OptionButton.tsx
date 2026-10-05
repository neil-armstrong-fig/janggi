import type {WithName} from "@src/react/pages/game/types/WithName";
import {clsx} from "clsx";
import {toSlug} from "@src/react/pages/game/components/settings/components/option-picker/utils/ToSlug";

/**
 * One option in a picker: its name, pressed when it is the one in use.
 *
 * The option's name is its id, carried in `data-option`, and the acceptance tests read which one is pressed
 * off that rather than off what the button says — so the words drawn on it, or a picture beside them, may
 * change (be translated, say) without a spec noticing. A locked option is disabled and says why in its title
 * rather than in its text, for the same reason, and carries `data-locked` for a spec to read.
 */
interface Props<Option extends WithName> {
  readonly pickerId: string;
  readonly option: Option;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly lockedReason: string | undefined;
  /** A picture drawn before the name, for an option a player can tell apart without reading it. */
  readonly icon?: React.ReactNode;
  /** What the button says, where that is not the option's name. */
  readonly label?: string;
  readonly onSelect: (option: Option) => void;
}

export function OptionButton<Option extends WithName>({
  pickerId,
  option,
  selected,
  disabled,
  lockedReason,
  icon,
  label = option.name,
  onSelect,
}: Props<Option>): React.JSX.Element {
  const locked = lockedReason !== undefined;

  return (
    <button
      type="button"
      data-testid={`${pickerId}-option-${toSlug(option.name)}`}
      data-option={option.name}
      data-locked={locked || undefined}
      aria-pressed={selected}
      disabled={disabled || locked}
      title={locked ? `Locked: ${lockedReason}` : undefined}
      onClick={() => onSelect(option)}
      className={clsx(
        "flex min-h-11 min-w-fit flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none",
        selected && "bg-wood text-ink shadow",
        !selected && "text-white/70 enabled:hover:bg-white/10",
      )}
    >
      {icon}

      {label}
    </button>
  );
}
