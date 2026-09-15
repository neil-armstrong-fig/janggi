import type {WithName} from "@src/react/pages/game/types/WithName";
import {ExplanationToggle} from "@src/react/pages/game/components/settings/components/option-picker/components/explanation-toggle/ExplanationToggle";
import {OptionButton} from "@src/react/pages/game/components/settings/components/option-picker/components/option-button/OptionButton";
import {OptionSelect} from "@src/react/pages/game/components/settings/components/option-picker/components/option-select/OptionSelect";
import {useId, useState} from "react";

/**
 * One setting in the sheet: its label over its options, exactly one of them chosen.
 *
 * Generic over anything with a name, because board styles, piece sets, opening setups and the rest
 * are all lists of named things, and near-identical pickers would be that many places to fix a bug.
 *
 * **Two options are a row of buttons; more are a dropdown.** Two names sit side by side across a
 * phone and are one tap to switch. Five setups did not fit, and scrolling a row sideways under a thumb
 * was awkward — a native dropdown opens the phone's own picker instead. The picker decides by the
 * length of its list, so a setting that grows a third option changes shape without being told to.
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
  readonly options: readonly Option[];
  /**
   * The option in use, or nothing where no choice has been made yet — a scored game's setup pickers
   * open empty, because laying out is an act rather than a default.
   */
  readonly selected: Option | undefined;
  /** A picker whose choice is no longer available — a setup, once play has begun. */
  readonly disabled?: boolean;
  /** What the options mean, unfolded from a (?) beside the label. */
  readonly explanation?: React.ReactNode;
  readonly onSelect: (option: Option) => void;
}

export function OptionPicker<Option extends WithName>({
  id,
  label,
  ariaLabel,
  options,
  selected,
  disabled = false,
  explanation,
  onSelect,
}: Props<Option>): React.JSX.Element {
  const [explained, setExplained] = useState(false);
  const explanationId = useId();
  const asDropdown = options.length > MOST_BUTTONS;

  return (
    <nav data-testid={`${id}-picker`} aria-label={ariaLabel ?? label} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-white/60">{label}</span>

        {explanation !== undefined && (
          <ExplanationToggle
            pickerId={id}
            label={label}
            expanded={explained}
            controls={explanationId}
            onToggle={() => setExplained(shown => !shown)}
          />
        )}
      </div>

      {!asDropdown && (
        <div className="flex gap-1 rounded-xl bg-black/25 p-1">
          {options.map(option => (
            <OptionButton
              key={option.name}
              pickerId={id}
              option={option}
              selected={option.name === selected?.name}
              disabled={disabled}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {asDropdown && (
        <OptionSelect
          pickerId={id}
          label={ariaLabel ?? label}
          options={options}
          selected={selected}
          disabled={disabled}
          onSelect={onSelect}
        />
      )}

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
const MOST_BUTTONS = 2;
