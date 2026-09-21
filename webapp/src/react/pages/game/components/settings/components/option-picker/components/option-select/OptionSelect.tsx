import type {WithName} from "@src/react/pages/game/types/WithName";
import {clsx} from "clsx";
import {toSlug} from "@src/react/pages/game/components/settings/components/option-picker/utils/ToSlug";

/**
 * A picker's options as a native dropdown, for a list too long for buttons or one whose options can be
 * locked.
 *
 * Native rather than drawn, because on a phone it opens the device's own picker, which is what a
 * thumb already knows. Each option still carries the same `<id>-option-<slug>` test id a button
 * would, so the acceptance tests name an option the same way whichever shape the picker takes.
 *
 * While nothing has been chosen the dropdown shows a placeholder that cannot itself be picked, and it
 * goes away once a real option has been.
 *
 * **A locked option is listed but cannot be picked**, with a padlock and the reason after its name —
 * a native option has nowhere else to say it. Its `value` stays the bare name, so a spec still chooses
 * and reads options by value, and `data-locked` says which are locked.
 *
 * The text is 16px because iOS zooms the page into any form field smaller than that when it is
 * focused.
 */
interface Props<Option extends WithName> {
  readonly pickerId: string;
  readonly label: string;
  readonly options: readonly Option[];
  readonly selected: Option | undefined;
  readonly disabled: boolean;
  readonly lockedReason: ((option: Option) => string | undefined) | undefined;
  readonly onSelect: (option: Option) => void;
}

export function OptionSelect<Option extends WithName>({
  pickerId,
  label,
  options,
  selected,
  disabled,
  lockedReason,
  onSelect,
}: Props<Option>): React.JSX.Element {
  return (
    <div className="relative">
      <select
        data-testid={`${pickerId}-select`}
        aria-label={label}
        value={selected?.name ?? ""}
        disabled={disabled}
        onChange={event => {
          const chosen = options.find(option => option.name === event.target.value);
          if (chosen) onSelect(chosen);
        }}
        className="w-full cursor-pointer appearance-none rounded-xl bg-black/25 py-2.5 pr-10 pl-3 text-base font-medium text-white/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {selected === undefined && (
          <option value="" disabled className="bg-ground-raised">
            Not yet chosen
          </option>
        )}

        {options.map(option => {
          const reason = lockedReason?.(option);

          return (
            <option
              key={option.name}
              data-testid={`${pickerId}-option-${toSlug(option.name)}`}
              data-locked={reason !== undefined || undefined}
              value={option.name}
              disabled={reason !== undefined}
              className="bg-ground-raised"
            >
              {reason === undefined ? option.name : `${option.name} — 🔒 ${reason}`}
            </option>
          );
        })}
      </select>

      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={clsx(
          "pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-white/60",
          disabled && "opacity-40",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
