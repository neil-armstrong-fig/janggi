import {BoardSetting} from "@src/react/pages/game/components/settings/components/board-setting/BoardSetting";
import {BotStrengthSetting} from "@src/react/pages/game/components/settings/components/bot-strength-setting/BotStrengthSetting";
import {EffectsSetting} from "@src/react/pages/game/components/settings/components/effects-setting/EffectsSetting";
import {ElephantPairingLine} from "@src/react/pages/game/components/settings/components/elephant-pairing-line/ElephantPairingLine";
import {GuideLink} from "@src/react/pages/game/components/settings/components/guide-link/GuideLink";
import {InstallButton} from "@src/react/pages/game/components/settings/components/install-button/InstallButton";
import {MatchFormatSetting} from "@src/react/pages/game/components/settings/components/match-format-setting/MatchFormatSetting";
import {MovableHighlightSetting} from "@src/react/pages/game/components/settings/components/movable-highlight-setting/MovableHighlightSetting";
import {MusicSetting} from "@src/react/pages/game/components/settings/components/music-setting/MusicSetting";
import {NewGameButton} from "@src/react/pages/game/components/settings/components/new-game-button/NewGameButton";
import {OpponentSetting} from "@src/react/pages/game/components/settings/components/opponent-setting/OpponentSetting";
import {PieceSetSetting} from "@src/react/pages/game/components/settings/components/piece-set-setting/PieceSetSetting";
import {Progress} from "@src/react/pages/game/components/settings/components/progress/Progress";
import {RecordButton} from "@src/react/pages/game/components/settings/components/record-button/RecordButton";
import {ReferencesLink} from "@src/react/pages/game/components/settings/components/references-link/ReferencesLink";
import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {SetupSetting} from "@src/react/pages/game/components/settings/components/setup-setting/SetupSetting";
import {SoundEffectsSetting} from "@src/react/pages/game/components/settings/components/sound-effects-setting/SoundEffectsSetting";
import {StylesButton} from "@src/react/pages/game/components/settings/components/styles-button/StylesButton";
import {YourSideSetting} from "@src/react/pages/game/components/settings/components/your-side-setting/YourSideSetting";
import {clsx} from "clsx";

/**
 * Everything a player may choose about the game and about how it is drawn, in a sheet that slides
 * up over the lower part of the screen when it is asked for.
 *
 * A sheet rather than a panel under the board, because six rows of options were taller than a short
 * window had to spare and the board is what the screen is for. The board stays visible above it, so
 * a new board style or piece set is seen being worn the moment it is picked.
 *
 * **It is always in the page, only moved out of sight.** Closed, it sits below the bottom edge and is
 * `inert`, so nothing in it can be tapped or focused — but every picker's pressed and disabled state
 * is still there to be read, and nothing is remounted each time it opens.
 *
 * Four groups fold away under their headings so the sheet is not one long scroll. Only **This game**
 * starts laid out, being what a player opens the sheet for before a game. **Appearance** and **Sound &
 * effects** hold preferences worn immediately; **Progress** holds the XP, what it opens next, and the
 * save key that carries it to another device.
 *
 * **It is layout, and only layout.** Each concrete setting reads the value it draws from the store and
 * dispatches its own choice. This sheet decides only their grouping and order, and keeps only the state
 * the store cannot own: whether the sheet is open, and which sibling sheet should replace it.
 */
interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onOpenRecord: () => void;
  readonly onOpenStyles: () => void;
}

export function Settings({open, onClose, onOpenRecord, onOpenStyles}: Props): React.JSX.Element {
  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 motion-reduce:transition-none",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <section
        data-testid="settings"
        role="dialog"
        aria-label="Settings"
        aria-modal={open}
        inert={!open}
        className={clsx(
          "md:opacity-96 opacity-93 fixed inset-x-0 bottom-0 z-20 mx-auto flex max-h-[80dvh] w-full max-w-lg flex-col rounded-t-2xl bg-ground-raised transition-transform duration-300 ease-out motion-reduce:transition-none",
          open ? "translate-y-0 shadow-2xl shadow-black" : "translate-y-full",
        )}
      >
        <header className="flex shrink-0 items-center justify-between px-4 pt-3 pb-1">
          <h2 className="text-sm font-semibold tracking-wide text-wood uppercase">Settings</h2>

          <button
            type="button"
            data-testid="settings-close"
            aria-label="Close settings"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <SettingsGroup title="This game" initiallyOpen>
            <MatchFormatSetting />

            <OpponentSetting />

            <BotStrengthSetting />

            <YourSideSetting />

            <SetupSetting side="han" />

            <SetupSetting side="cho" />

            <ElephantPairingLine />

            <NewGameButton onStarted={onClose} />

            <RecordButton onOpen={onOpenRecord} />
          </SettingsGroup>

          <SettingsGroup title="Appearance">
            <BoardSetting />

            <PieceSetSetting />

            <MovableHighlightSetting />

            <StylesButton onOpen={onOpenStyles} />
          </SettingsGroup>

          <SettingsGroup title="Progress">
            <Progress />
          </SettingsGroup>

          <SettingsGroup title="Sound & effects">
            <SoundEffectsSetting />

            <MusicSetting />

            <EffectsSetting />
          </SettingsGroup>

          <div className="flex flex-col gap-2">
            <InstallButton />

            <GuideLink />

            <ReferencesLink />
          </div>
        </div>
      </section>
    </>
  );
}
