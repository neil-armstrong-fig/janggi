import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";

/**
 * One tab's worth of the settings sheet: its settings in a column that scrolls if it has to, and
 * optionally a footer that stays put beneath them.
 *
 * **It is always in the page, only hidden.** A pane whose tab is not showing is `hidden` rather than
 * unmounted, so every picker's pressed and disabled state is still there to be read and nothing is
 * remounted when its tab is chosen again — the same reason the sheet itself is only moved out of
 * sight, and it is what lets the acceptance tests read a setting without opening its tab.
 *
 * The footer is for what a player reaches for after choosing: on the Game pane, dealing the new
 * game. Outside the scrolling column, it is in the thumb's reach however far the settings above it
 * have been scrolled.
 */
interface Props {
  readonly name: SettingsTabName;
  readonly selected: boolean;
  readonly footer?: React.ReactNode;
  readonly children: React.ReactNode;
}

export function SettingsPane({name, selected, footer, children}: Props): React.JSX.Element {
  return (
    <div
      role="tabpanel"
      data-testid="settings-pane"
      data-pane={name}
      aria-label={name}
      hidden={!selected}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-3">{children}</div>

      {footer !== undefined && (
        <div className="shrink-0 border-t border-white/10 bg-black/20 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      )}
    </div>
  );
}
