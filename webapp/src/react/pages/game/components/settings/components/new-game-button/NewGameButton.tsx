import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {restarted} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Deals a fresh game, abandoning whatever was being played.
 *
 * The board does not clear itself when a game ends, so a new one has to be asked for. It doubles as
 * the way back to the setup pickers, which lock once a move has been played because a back rank is
 * arranged strictly before play.
 *
 * In the settings sheet, under the format and the two setups, rather than in the row of controls
 * under the board. It deals from those three, so it belongs beside them — and a control that throws a
 * game away is better a sheet away from a thumb that was reaching for Undo. Once a game has ended the
 * announcement of its result offers New game as well, there being nothing left to throw away.
 */
interface Props {
  /** Called once the game has been dealt, so the sheet that held the control can close. */
  readonly onStarted: () => void;
}

export function NewGameButton({onStarted}: Props): React.JSX.Element {
  const {played, opponent} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  return (
    <>
      <button
        type="button"
        data-testid="new-game"
        onClick={() => {
          dispatch(restarted());
          onStarted();
        }}
        className="h-11 cursor-pointer rounded-xl border border-wood/40 text-sm font-semibold tracking-wide text-wood uppercase transition-[transform,background-color] duration-150 hover:bg-wood/10 active:scale-[0.98] motion-reduce:transition-none"
      >
        New game
      </button>

      {opponent.name === "Bot" && playHasBegun(played) && (
        <p className="-mt-1 text-xs text-white/50">Starting a new game now counts as a loss.</p>
      )}
    </>
  );
}
