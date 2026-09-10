import {BikjangButton} from "@src/react/pages/game/components/status/components/bikjang-button/BikjangButton";
import {NewGameButton} from "@src/react/pages/game/components/status/components/new-game-button/NewGameButton";
import {PassButton} from "@src/react/pages/game/components/status/components/pass-button/PassButton";
import {RedoButton} from "@src/react/pages/game/components/status/components/redo-button/RedoButton";
import {Scoreboard} from "@src/react/pages/game/components/status/components/scoreboard/Scoreboard";
import {TurnIndicator} from "@src/react/pages/game/components/status/components/turn-indicator/TurnIndicator";
import {UndoButton} from "@src/react/pages/game/components/status/components/undo-button/UndoButton";
import {bikjangCalled, passed, playedAgain, restarted, takenBack} from "@src/redux/game/GameSlice";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {canPass} from "@src/game/passing/CanPass";
import {canRedo} from "@src/game/record/CanRedo";
import {canUndo} from "@src/game/record/CanUndo";
import {isArranged} from "@src/game/setups/IsArranged";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Where the game says what it is doing, rather than what is standing on it: whose turn it is, what
 * each army is worth, and every control a player reaches for that is not a move.
 *
 * Resting a turn and calling a bikjang are here rather than on the board because they are the two
 * things a player does that touch no intersection. Resting is also the one way out of a position
 * with nothing to play, janggi having no stalemate.
 *
 * Undo and Redo are the only two controls in here **not** gated on the game still being undecided —
 * taking back the turn that ended a game is the ordinary reason to reach for one.
 *
 * The row wraps, because six controls and a scoreboard do not fit across a phone.
 *
 * It reads the store itself rather than taking a dozen props. A page section is the level where
 * that is worth doing; the components below it stay pure, take what they draw, and know nothing
 * about Redux.
 */
export function Status(): React.JSX.Element {
  const {played, phase} = useAppSelector(state => state.game);
  const game = played.present;
  const dispatch = useAppDispatch();

  // A scored board is still being laid out until both armies have chosen, and until then there is
  // no game here to play — the pieces on screen are only what `boardShownFor` is painting.
  const laidOut = isArranged(phase);

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <TurnIndicator game={game} phase={phase} />

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Scoreboard game={game} />

        <PassButton enabled={laidOut && canPass(game)} onPass={() => dispatch(passed())} />

        <BikjangButton enabled={laidOut && canCallBikjang(game)} onCall={() => dispatch(bikjangCalled())} />

        <UndoButton enabled={canUndo(played)} onUndo={() => dispatch(takenBack())} />

        <RedoButton enabled={canRedo(played)} onRedo={() => dispatch(playedAgain())} />

        <NewGameButton onStart={() => dispatch(restarted())} />
      </div>
    </div>
  );
}
