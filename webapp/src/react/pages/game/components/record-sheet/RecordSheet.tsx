import {sheetClosed} from "@src/redux/settings/SettingsSlice";
import {DEFAULT_MATCH_FORMAT} from "@janggi/shared/janggi/settings/MatchFormat";
import {FormatTabs} from "@src/react/pages/game/components/record-sheet/components/format-tabs/FormatTabs";
import {GameHistory} from "@src/react/pages/game/components/record-sheet/components/game-history/GameHistory";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {RecordTable} from "@src/react/pages/game/components/record-sheet/components/record-table/RecordTable";
import {ResetRecordButton} from "@src/react/pages/game/components/record-sheet/components/reset-record-button/ResetRecordButton";
import {clsx} from "clsx";
import {recordReset} from "@src/redux/ratings/RatingsSlice";
import {recordsAgainstBots} from "@src/react/pages/game/components/record-sheet/records-against-bots/RecordsAgainstBots";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useState} from "react";

/**
 * The player's record against the bot: their rating in each format, how they have fared against each
 * strength — overall and with each army — and every game behind it, newest first.
 *
 * **A sheet over the game, like `Settings`**, rather than a page of its own, so the game underneath is
 * never left: the music plays on, a bot mid-thought keeps thinking, and closing it is a return to
 * exactly where the player was. Like that sheet it is always in the page and only moved out of sight
 * and made `inert` while closed.
 *
 * One tab per format, because the two are rated apart. Everything on it is worked out from the games
 * kept in the store; none of the percentages is stored.
 *
 * The record can be started again from the foot of the sheet, and asks before it clears anything.
 *
 * The bot is Fairy-Stockfish, which is GPL-3.0 licensed; the credit at the foot of the sheet links its
 * licence as shipped and its source, each in a tab of its own so the game is not navigated away from.
 */
export function RecordSheet(): React.JSX.Element {
  const open = useAppSelector(state => state.settings.openSheet === "record");
  const dispatch = useAppDispatch();
  const onClose = (): void => {
    dispatch(sheetClosed());
  };
  const [format, setFormat] = useState<MatchFormat>(DEFAULT_MATCH_FORMAT);
  const rating = useAppSelector(state => state.ratings.byFormat[format]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 motion-reduce:transition-none",
          open && "opacity-100",
          !open && "pointer-events-none opacity-0",
        )}
      />

      <section
        data-testid="record"
        role="dialog"
        aria-label="Your record"
        aria-modal={open}
        inert={!open}
        className={clsx(
          "fixed inset-x-0 bottom-0 z-20 mx-auto flex max-h-[85dvh] select-none w-full max-w-lg flex-col rounded-t-2xl bg-ground-raised transition-transform duration-300 ease-out motion-reduce:transition-none",
          open && "translate-y-0 shadow-2xl shadow-black",
          !open && "translate-y-full",
        )}
      >
        <header className="flex shrink-0 items-center justify-between px-4 pt-3 pb-1">
          <h2 className="text-sm font-semibold tracking-wide text-wood uppercase">Your record</h2>

          <button
            type="button"
            data-testid="record-close"
            aria-label="Close your record"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex flex-col gap-5 overflow-y-auto px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <FormatTabs selected={format} onSelect={setFormat} />

          <p data-testid="record-elo" data-elo={rating.elo} className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold text-gold tabular-nums">{rating.elo}</span>

            <span className="text-xs tracking-wide text-white/60 uppercase">{format} Elo</span>
          </p>

          <RecordTable records={recordsAgainstBots(rating.games)} />

          <GameHistory games={rating.games} />

          <ResetRecordButton onReset={() => dispatch(recordReset())} />

          <p className="text-xs text-white/40">
            The bot is{" "}
            <a
              className="underline"
              href="https://github.com/fairy-stockfish/Fairy-Stockfish"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fairy-Stockfish
            </a>
            , free software under the{" "}
            <a
              className="underline"
              href={`${import.meta.env.BASE_URL}engine/Copying.txt`}
              target="_blank"
              rel="noopener noreferrer"
            >
              GPL-3.0
            </a>
            . Its strengths are nominal Elo, calibrated on chess rather than janggi.
          </p>
        </div>
      </section>
    </>
  );
}
