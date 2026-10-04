import {SETTINGS_TAB_NAMES} from "@janggi/shared/janggi/settings/SettingsTabName";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import {clsx} from "clsx";

/**
 * The row along the top of the settings sheet that chooses which pane is showing — Game, Look,
 * Sound, Progress, Account — so the sheet is one short pane at a time instead of one long scroll.
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
    <div role="tablist" aria-label="Kinds of setting" className="grid min-w-0 flex-1 grid-cols-4 gap-0.5">
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
            "relative h-12 w-full min-w-0 cursor-pointer overflow-hidden rounded-lg text-[0.6875rem] font-semibold tracking-normal transition-colors duration-150 min-[360px]:text-xs min-[400px]:tracking-wide sm:text-sm motion-reduce:transition-none",
            name === selected && "text-wood",
            name !== selected && "text-white/50 hover:text-white/80",
          )}
        >
          {name === selected && (
            <span
              data-testid="settings-tab-highlight"
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-lg bg-wood/15"
            />
          )}

          <span className="relative">{name}</span>
        </button>
      ))}
    </div>
  );
}
