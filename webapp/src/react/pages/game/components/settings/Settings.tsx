import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import {
  BOT_STRENGTH_OPTIONS,
  OPPONENT_OPTIONS,
  SIDE_CHOICE_OPTIONS,
} from "@src/react/pages/game/components/settings/utils/OpponentOptions";
import {EFFECTS} from "@src/react/pages/game/utils/EffectsOptions";
import {ElephantPairingLine} from "@src/react/pages/game/components/settings/components/elephant-pairing-line/ElephantPairingLine";
import {MATCH_FORMAT_OPTIONS} from "@src/react/pages/game/components/settings/utils/MatchFormats";
import {MatchFormatExplanation} from "@src/react/pages/game/components/settings/components/match-format-explanation/MatchFormatExplanation";
import {MOVABLE_HIGHLIGHTS} from "@src/react/pages/game/utils/MovableHighlights";
import {NewGameButton} from "@src/react/pages/game/components/settings/components/new-game-button/NewGameButton";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {RecordButton} from "@src/react/pages/game/components/settings/components/record-button/RecordButton";
import {ReferencesLink} from "@src/react/pages/game/components/settings/components/references-link/ReferencesLink";
import {SETUPS} from "@src/game/setups/Setups";
import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {
  boardStyleChosen,
  effectsChosen,
  movableHighlightChosen,
  musicVolumeChanged,
  pieceSetChosen,
  soundEffectsVolumeChanged,
} from "@src/redux/preferences/PreferencesSlice";
import {VolumeSlider} from "@src/react/pages/game/components/settings/components/volume-slider/VolumeSlider";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {canPlace} from "@src/game/setups/CanPlace";
import {clsx} from "clsx";
import {
  botStrengthChosen,
  choSetupChosen,
  formatChosen,
  hanSetupChosen,
  opponentChosen,
  restarted,
  sideChosen,
} from "@src/redux/game/GameSlice";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

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
 * Three groups, each folding away under its heading so the sheet is not one long scroll — only **This
 * game** starts laid out, being what a player opens the sheet for before a game. **This game** holds the settings
 * that are part of the game — dealt through the store, and locked on `playHasBegun` — together with
 * New game, which deals from them. **Appearance** holds the three that are preferences about how a
 * game is drawn; they are the store's `preferences` slice, read here through `usePreferences` just as
 * the board reads them to wear, and they never restart anything. **Sound & effects** holds three more
 * preferences of the same kind — how loud the game's sounds are, how loud the music under it is, and
 * how much the board moves — in the same slice.
 *
 * The two armies get a setup picker each because they genuinely choose separately: Han lays out
 * first, Cho answers, and whether the elephants end up on the same wing or facing each other across
 * the board is the result of those two choices rather than of one setting. See `Setups.ts`, and the
 * line under the two pickers, which names that pairing where the game has a name for it.
 *
 * In a **scored** game that order is a rule — `docs/rules.md` §6.6 — so the two pickers open empty,
 * Cho's waits for Han, and Han's closes the moment it is used. In a **casual** game none of that
 * applies: the pieces are simply dealt on the common arrangement and either army may be re-chosen
 * until the first move. The rule itself is `canPlace`.
 *
 * Which of janggi's two games is being played is a picker beside the setups rather than beside the
 * board style, because it is not a preference about how the game is drawn: it decides whether a
 * bikjang may be called at all and whether one draws. Like a back rank it is settled before play,
 * so it locks on the same question the setups do. Its two names say nothing to a player who has not
 * read the rules, so it carries a (?) that unfolds `MatchFormatExplanation`, and that answers even once
 * the format is locked.
 *
 * **Who the opponent is** sits with them for the same reason — against the bot, how strongly it plays
 * and which army is the player's. All three are dealt and lock with the rest. Against the bot, the
 * bot's own army lays itself out, so its setup picker is closed to the player. The bot needs the page
 * cross-origin isolated (`docs/bot.md`); where the browser will not isolate it, the opponent picker is
 * closed and a line says why.
 */
interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onOpenRecord: () => void;
}

export function Settings({open, onClose, onOpenRecord}: Props): React.JSX.Element {
  const {played, phase, opponent} = useAppSelector(state => state.game);
  const {boardStyle, pieceStyle, movableHighlight, effects, soundEffectsVolume, musicVolume} = usePreferences();
  const dispatch = useAppDispatch();

  const settled = playHasBegun(played);
  const againstBot = opponent.name === "Bot";
  const botAvailable = globalThis.crossOriginIsolated;
  const isBotsArmy = (side: Side): boolean => againstBot && opponentOf(opponent.playerSide) === side;

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
          "fixed inset-x-0 bottom-0 z-20 mx-auto flex max-h-[80dvh] w-full max-w-lg flex-col rounded-t-2xl bg-ground-raised transition-transform duration-300 ease-out motion-reduce:transition-none",
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
            <OptionPicker
              id="match-format"
              disabled={settled}
              label="Format"
              ariaLabel="Which of janggi's two games is being played"
              options={MATCH_FORMAT_OPTIONS}
              selected={{name: phase.format}}
              explanation={<MatchFormatExplanation />}
              onSelect={option => dispatch(formatChosen(option.name))}
            />

            <OptionPicker
              id="opponent"
              disabled={settled || (!botAvailable && !againstBot)}
              label="Opponent"
              ariaLabel="Who plays the other army"
              options={OPPONENT_OPTIONS}
              selected={{name: opponent.name}}
              onSelect={option => dispatch(opponentChosen(option.name))}
            />

            {!botAvailable && (
              <p className="-mt-1 text-xs text-white/50">
                This browser cannot run the bot: it needs a cross-origin isolated page.
              </p>
            )}

            <OptionPicker
              id="bot-strength"
              disabled={settled || !againstBot}
              label="Bot strength"
              ariaLabel="How strongly the bot plays, as an Elo rating"
              options={BOT_STRENGTH_OPTIONS}
              selected={BOT_STRENGTH_OPTIONS.find(option => option.elo === opponent.botElo)}
              onSelect={option => dispatch(botStrengthChosen(option.elo))}
            />

            <OptionPicker
              id="your-side"
              disabled={settled || !againstBot}
              label="Your side"
              ariaLabel="Which army you play against the bot"
              options={SIDE_CHOICE_OPTIONS}
              selected={{name: opponent.sideChoice}}
              onSelect={option => dispatch(sideChosen(option.name))}
            />

            <OptionPicker
              id="han-setup"
              disabled={settled || isBotsArmy("han") || !canPlace(phase, "han")}
              label="Han's setup"
              ariaLabel="Han's opening setup"
              options={SETUPS}
              selected={phase.hanSetup}
              onSelect={setup => dispatch(hanSetupChosen(setup))}
            />

            <OptionPicker
              id="cho-setup"
              disabled={settled || isBotsArmy("cho") || !canPlace(phase, "cho")}
              label="Cho's setup"
              ariaLabel="Cho's opening setup"
              options={SETUPS}
              selected={phase.choSetup}
              onSelect={setup => dispatch(choSetupChosen(setup))}
            />

            <ElephantPairingLine hanSetup={phase.hanSetup} choSetup={phase.choSetup} />

            <NewGameButton
              onStart={() => {
                dispatch(restarted());
                onClose();
              }}
            />

            {againstBot && settled && (
              <p className="-mt-1 text-xs text-white/50">Starting a new game now counts as a loss.</p>
            )}

            <RecordButton onOpen={onOpenRecord} />
          </SettingsGroup>

          <SettingsGroup title="Appearance">
            <OptionPicker
              id="board-style"
              label="Board"
              options={BUILT_IN_STYLES}
              selected={boardStyle}
              onSelect={style => dispatch(boardStyleChosen(style.name))}
            />

            <OptionPicker
              id="piece-style"
              label="Pieces"
              options={BUILT_IN_PIECE_STYLES}
              selected={pieceStyle}
              onSelect={set => dispatch(pieceSetChosen(set.name))}
            />

            <OptionPicker
              id="movable-highlight"
              label="Movable pieces"
              ariaLabel="Highlight the pieces that can move"
              options={MOVABLE_HIGHLIGHTS}
              selected={movableHighlight}
              onSelect={highlight => dispatch(movableHighlightChosen(highlight.name))}
            />
          </SettingsGroup>

          <SettingsGroup title="Sound & effects">
            <VolumeSlider
              id="sound-effects"
              label="Sound effects"
              volume={soundEffectsVolume}
              onChange={volume => dispatch(soundEffectsVolumeChanged(volume))}
            />

            <VolumeSlider
              id="music"
              label="Music"
              volume={musicVolume}
              onChange={volume => dispatch(musicVolumeChanged(volume))}
            />

            <OptionPicker
              id="effects"
              label="Effects"
              ariaLabel="How much the board moves as the game is played"
              options={EFFECTS}
              selected={effects}
              onSelect={chosen => dispatch(effectsChosen(chosen.name))}
            />
          </SettingsGroup>

          <ReferencesLink />
        </div>
      </section>
    </>
  );
}
