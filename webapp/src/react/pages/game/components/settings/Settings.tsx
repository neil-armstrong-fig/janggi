import {GamePane} from "@src/react/pages/game/components/settings/tabs/game-pane/GamePane";
import {LookPane} from "@src/react/pages/game/components/settings/tabs/look-pane/LookPane";
import {ProgressPane} from "@src/react/pages/game/components/settings/tabs/progress-pane/ProgressPane";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import {SettingsTabs} from "@src/react/pages/game/components/settings/components/settings-tabs/SettingsTabs";
import {SoundPane} from "@src/react/pages/game/components/settings/tabs/sound-pane/SoundPane";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {clsx} from "clsx";
import {useState} from "react";

/** Lets `Settings.tsx` set `--sheet-opacity` inline without an unnamed cast at the call site. */
interface SheetPanelStyle extends React.CSSProperties {
  "--sheet-opacity": string;
}

/**
 * Everything a player may choose about the game and about how it is drawn, in a sheet that slides
 * up over the lower part of the screen when it is asked for.
 *
 * A sheet rather than a panel under the board, because the board is what the screen is for and it
 * stays visible above — and, through the sheet, behind it. The sheet is short and its panel is a
 * little see-through, so choosing a setup shows the pieces being laid out again where the thumb is
 * pressing, and a new board style or piece set is seen being worn the moment it is picked. Only the
 * panel's **background** is see-through: the text and the controls are drawn at full strength, so what
 * is behind is a suggestion and never something to read past. How much is the player's own choice, in
 * the Look tab, since the same blur reads differently from one screen to another.
 *
 * **Four tabs, one pane at a time**, so the sheet is never one long scroll — `GamePane`, `LookPane`,
 * `SoundPane` and `ProgressPane`, each of which lays out its own settings. **Game** is what a player
 * opens the sheet for before a game; **Look** and **Sound** hold preferences worn immediately;
 * **Progress** holds the XP, the save key that carries it to another device, and the links out of the
 * game. The tabs that choose among them are the sheet's head, beside Close, and take the place of a
 * heading.
 *
 * **It is always in the page, only moved out of sight.** Closed, it sits below the bottom edge and is
 * `inert`, so nothing in it can be tapped or focused — but every picker's pressed and disabled state
 * is still there to be read, and nothing is remounted each time it opens. The same goes for a pane
 * whose tab is not showing.
 *
 * **It is layout, and only layout.** Each pane decides the grouping and order of its settings, and each
 * concrete setting reads the value it draws from the store and dispatches its own choice. This sheet
 * keeps only the state the store cannot own: whether the sheet is open, which tab is showing, and which
 * sibling sheet should replace it.
 */
interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onOpenRecord: () => void;
  readonly onOpenStyles: () => void;
}

export function Settings({open, onClose, onOpenRecord, onOpenStyles}: Props): React.JSX.Element {
  const [tab, setTab] = useState<SettingsTabName>("Game");
  const {sheetOpacity} = usePreferences();

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-10 bg-black/10 transition-opacity duration-300 motion-reduce:transition-none",
          open && "opacity-100",
          !open && "pointer-events-none opacity-0",
        )}
      />

      <section
        data-testid="settings"
        role="dialog"
        aria-label="Settings"
        aria-modal={open}
        inert={!open}
        style={{"--sheet-opacity": `${sheetOpacity}%`} as SheetPanelStyle}
        className={clsx(
          "settings-sheet-panel fixed inset-x-0 bottom-0 z-20 mx-auto flex h-[60dvh] w-full max-w-lg flex-col rounded-t-2xl backdrop-blur-[1px] transition-transform duration-300 ease-out select-none not-supports-[backdrop-filter:blur(1px)]:bg-ground-raised motion-reduce:transition-none",
          open && "translate-y-0 shadow-2xl shadow-black",
          !open && "translate-y-full",
        )}
      >
        <header className="flex shrink-0 items-center gap-1 border-b border-white/10 px-2 pt-3 pb-1">
          <SettingsTabs selected={tab} onSelect={setTab} />

          <button
            type="button"
            data-testid="settings-close"
            aria-label="Close settings"
            onClick={onClose}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <GamePane selected={tab === "Game"} onStarted={onClose} onOpenRecord={onOpenRecord} />

        <LookPane selected={tab === "Look"} onOpenStyles={onOpenStyles} />

        <SoundPane selected={tab === "Sound"} />

        <ProgressPane selected={tab === "Progress"} />
      </section>
    </>
  );
}
