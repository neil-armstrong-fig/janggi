/**
 * Which style the one being made is previewed with — a piece set, for a board; a board, for a piece set — so a
 * style can be seen against setups other than the one the player is playing with. It changes only the
 * preview: nothing is worn until a style is saved.
 *
 * It begins on the current one, which is however the player has the game set — for the pieces, possibly a
 * different set for each army.
 */
interface Props {
  /** What the choice is for, in words that finish a sentence: `Preview with`, `Preview on`. */
  readonly label: string;
  /** The first option, standing for whatever the player has now: `Current pieces`, `Current board`. */
  readonly currentLabel: string;
  readonly names: readonly string[];
  /** The name of the style chosen, or an empty string for the current one. */
  readonly value: string;
  readonly onChange: (name: string) => void;
}

export function CompanionPicker({label, currentLabel, names, value, onChange}: Props): React.JSX.Element {
  return (
    <label className="flex items-center gap-2 text-xs text-white/60">
      <span className="shrink-0">{label}</span>

      <select
        data-testid="style-editor-companion"
        value={value}
        onChange={event => onChange(event.target.value)}
        className="h-8 min-w-0 flex-1 rounded-lg bg-black/25 px-2 text-sm text-white/90"
      >
        <option value="" className="bg-ground-raised">
          {currentLabel}
        </option>

        {names.map(name => (
          <option key={name} value={name} className="bg-ground-raised">
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
