import type {WithName} from "@src/react/pages/game/types/WithName";
import {ExplanationToggle} from "@src/react/pages/game/components/settings/components/explanation-toggle/ExplanationToggle";
import {OptionButton} from "@src/react/pages/game/components/settings/components/option-picker/components/option-button/OptionButton";
import {OptionSelect} from "@src/react/pages/game/components/settings/components/option-picker/components/option-select/OptionSelect";
import {clsx} from "clsx";
import {useId, useState} from "react";

/**
 * One setting in the sheet: its label over its options, exactly one of them chosen.
 *
 * Generic over anything with a name, because board styles, piece sets, opening setups and the rest
 * are all lists of named things, and near-identical pickers would be that many places to fix a bug.
 *
 * **A short list is buttons that wrap; a long or lockable one is a dropdown.** Every option of up to
 * six is on screen at once and one tap away, wrapping onto a second row rather than scrolling
 * sideways under a thumb — and a native dropdown would cover the board with the phone's own picker,
 * where the point of the buttons is to watch the board change behind the sheet as one is pressed. A
 * list where an option can be **locked** stays a dropdown past two, because a native option has room
 * to say why in its label and a button has none a phone can show (`title` is a hover). The picker
 * decides by the list, so a setting that grows an option changes shape without being told to.
 *
 * **The label sits beside three buttons or fewer, and over more than that.** Format, Opponent and a
 * side to take are one row each rather than two, which is most of what a phone's sheet is short of; a
 * grid of setups is wide enough to want the whole line, so its label stays above it.
 *
 * **A setting whose names say too little can explain itself.** Handed an `explanation`, the picker puts a
 * (?) beside its label that unfolds it under the options, in the sheet rather than over it, so nothing
 * covers the choices being explained. The (?) is never disabled with the picker: a locked setting is
 * still one a player may want to understand.
 */
interface Props<Option extends WithName> {
  /** Prefixes the `data-testid` of the picker and of every option in it. */
  readonly id: string;
  readonly label: string;
  /** Read out in place of the label, where the label alone is too terse to stand on its own. */
  readonly ariaLabel?: string;
  /** Read out but not drawn, where something beside the picker already says what it is for. */
  readonly hideLabel?: boolean;
  readonly options: readonly Option[];
  /**
   * The option in use, or nothing where no choice has been made yet — a scored game's setup pickers
   * open empty, because laying out is an act rather than a default.
   */
  readonly selected: Option | undefined;
  /** A picker whose choice is no longer available — a setup, once play has begun. */
  readonly disabled?: boolean;
  /**
   * Why an option may not be chosen yet — the XP it costs, or the bot to beat first — or undefined for an
   * option that may. A locked option is still listed, so a player can see what there is to work towards.
   */
  readonly lockedReason?: (option: Option) => string | undefined;
  /** What the options mean, unfolded from a (?) beside the label. */
  readonly explanation?: React.ReactNode;
  readonly onSelect: (option: Option) => void;
}

export function OptionPicker<Option extends WithName>({
  id,
  label,
  ariaLabel,
  hideLabel = false,
  options,
  selected,
  disabled = false,
  lockedReason,
  explanation,
  onSelect,
}: Props<Option>): React.JSX.Element {
  const [explained, setExplained] = useState(false);
  const explanationId = useId();
  const asDropdown = options.length > (lockedReason === undefined ? MOST_BUTTONS : MOST_LOCKABLE_BUTTONS);
  const stacked = !asDropdown && options.length > MOST_BESIDE_LABEL;

  return (
    <nav data-testid={`${id}-picker`} aria-label={ariaLabel ?? label} className="flex flex-col gap-1.5">
      <div className={clsx("flex gap-x-3 gap-y-1.5", stacked ? "flex-col" : "items-center")}>
        <div className={clsx("flex items-center gap-1.5", !stacked && "w-24 shrink-0", hideLabel && "sr-only")}>
          <span className="text-xs font-medium text-white/60">{label}</span>

          {explanation !== undefined && (
            <ExplanationToggle
              testId={`${id}-explain`}
              ariaLabel={`What each ${label.toLowerCase()} means`}
              expanded={explained}
              controls={explanationId}
              onToggle={() => setExplained(shown => !shown)}
            />
          )}
        </div>

        {!asDropdown && (
          <div className={clsx("flex gap-1 rounded-xl bg-black/25 p-1", stacked ? "flex-wrap" : "min-w-0 flex-1")}>
            {options.map(option => (
              <OptionButton
                key={option.name}
                pickerId={id}
                option={option}
                selected={option.name === selected?.name}
                disabled={disabled}
                lockedReason={lockedReason?.(option)}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}

        {asDropdown && (
          <div className="min-w-0 flex-1">
            <OptionSelect
              pickerId={id}
              label={ariaLabel ?? label}
              options={options}
              selected={selected}
              disabled={disabled}
              lockedReason={lockedReason}
              onSelect={onSelect}
            />
          </div>
        )}
      </div>

      {explanation !== undefined && explained && (
        <div
          id={explanationId}
          data-testid={`${id}-explanation`}
          className="rounded-xl bg-black/25 p-3 text-sm text-white/85"
        >
          {explanation}
        </div>
      )}
    </nav>
  );
}

/** The most options a picker shows as buttons before it becomes a dropdown. */
const MOST_BUTTONS = 6;

/** The same, where an option can be locked and a dropdown is the only place to say why. */
const MOST_LOCKABLE_BUTTONS = 2;

/** The most buttons that sit on one line with their label, leaving more to wrap under it. */
const MOST_BESIDE_LABEL = 3;
