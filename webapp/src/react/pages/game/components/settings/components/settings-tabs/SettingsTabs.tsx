import {SETTINGS_TAB_NAMES} from "@janggi/shared/janggi/settings/SettingsTabName";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import {clsx} from "clsx";

/**
 * The row along the top of the settings sheet that chooses which pane is showing — Game, Look,
 * Sound, Progress — so the sheet is one short pane at a time instead of one long scroll.
 *
 * **In the sheet's head, beside Close, and no heading of its own.** A phone's sheet has little height
 * to spare and every row of chrome comes out of the room the settings have, so the tabs are the
 * heading: they say what the sheet is by what they offer. The sheet is a fixed height, so the row
 * does not move when a shorter pane is chosen. Each tab is 48px tall, the size a fingertip is
 * comfortable with.
 *
 * It only says which tab is showing. Every pane stays in the page whichever is chosen — see
 * `SettingsPane` — so choosing a tab hides a setting and changes nothing about it.
 */
interface Props {
  readonly selected: SettingsTabName;
  readonly onSelect: (tab: SettingsTabName) => void;
}

export function SettingsTabs({selected, onSelect}: Props): React.JSX.Element {
  return (
    <div role="tablist" aria-label="Kinds of setting" className="grid min-w-0 flex-1 grid-cols-4 gap-1">
      {SETTINGS_TAB_NAMES.map(name => (
        <button
          key={name}
          type="button"
          role="tab"
          data-testid="settings-tab"
          data-tab={name}
          aria-selected={name === selected}
          onClick={() => onSelect(name)}
          className={clsx(
            "h-12 cursor-pointer rounded-lg text-sm font-semibold tracking-wide transition-colors duration-150 motion-reduce:transition-none",
            name === selected ? "bg-wood/15 text-wood" : "text-white/50 hover:text-white/80",
          )}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
