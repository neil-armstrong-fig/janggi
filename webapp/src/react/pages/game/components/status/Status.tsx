import type {ArmyScores} from "@src/react/pages/game/components/status/types/ArmyScores";
import {BikjangButton} from "@src/react/pages/game/components/status/components/bikjang-button/BikjangButton";
import {PassButton} from "@src/react/pages/game/components/status/components/pass-button/PassButton";
import {PlayerPlaque} from "@src/react/pages/game/components/status/components/player-plaque/PlayerPlaque";
import {RedoButton} from "@src/react/pages/game/components/status/components/redo-button/RedoButton";
import {ResultBanner} from "@src/react/pages/game/components/status/components/result-banner/ResultBanner";
import {SettingsButton} from "@src/react/pages/game/components/status/components/settings-button/SettingsButton";
import {TurnIndicator} from "@src/react/pages/game/components/status/components/turn-indicator/TurnIndicator";
import {UndoButton} from "@src/react/pages/game/components/status/components/undo-button/UndoButton";
import {bikjangCalled, passed, playedAgain, restarted, takenBack} from "@src/redux/game/GameSlice";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {canPass} from "@src/game/passing/CanPass";
import {canRedo} from "@src/game/record/CanRedo";
import {canUndo} from "@src/game/record/CanUndo";
import {gameStatusOf} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import {isArranged} from "@src/game/setups/IsArranged";
import {plaqueStateOf} from "@src/react/pages/game/components/status/utils/PlaqueStateOf";
import {scoreFor} from "@src/game/scoring/ScoreFor";
import {takenFrom} from "@src/game/scoring/TakenFrom";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * Where the game says what it is doing, rather than what is standing on it: whose turn it is, what
 * each army is worth and has lost, how the game ended, and every control a player reaches for that is
 * not a move.
 *
 * **It frames the board.** Han's plaque runs across the top, above the ranks Han's pieces stand on,
 * and Cho's along the bottom, so an army's score and its losses sit on its own side of the board
 * rather than in one line both armies share. The herald — the one line saying what the game is doing
 * — sits under Han's plaque, and the controls sit under Cho's, nearest the thumb. The end of a game is
 * announced over the board itself.
 *
 * Resting a turn and calling a bikjang are controls rather than taps on the board because they are
 * the two things a player does that touch no intersection. Resting is also the one way out of a
 * position with nothing to play, janggi having no stalemate.
 *
 * Undo and Redo are the only two controls in here **not** gated on the game still being undecided —
 * taking back the turn that ended a game is the ordinary reason to reach for one.
 *
 * Starting a new game is not in the row. It lives in the settings sheet, beside the format and the
 * setups it deals from, where a stray thumb cannot abandon a game half played — and on the announcement
 * of a result, where there is no game left to abandon.
 *
 * With effects in full the frame answers a change the way the board does: a score counts down to its
 * new value, a lost piece pops into its tray, and the herald bumps as its words change. Every control
 * answers a press with a tick through `onControlPressed`, before whatever it does.
 *
 * It reads the store itself rather than taking a dozen props — the game, and the piece set the board
 * is wearing, so an army's losses are drawn the way they stood. A page section is the level where that
 * is worth doing; the components below it stay pure, take what they draw, and know nothing about Redux.
 */
interface Props {
  readonly onOpenSettings: () => void;
  readonly onControlPressed: () => void;
  /** The board, which goes between the two plaques. */
  readonly children: React.ReactNode;
}

export function Status({onOpenSettings, onControlPressed, children}: Props): React.JSX.Element {
  const {played, phase} = useAppSelector(state => state.game);
  const {pieceStyle, effects} = usePreferences();
  const game = played.present;
  const dispatch = useAppDispatch();

  // A scored board is still being laid out until both armies have chosen, and until then there is
  // no game here to play — the pieces on screen are only what `boardShownFor` is painting.
  const laidOut = isArranged(phase);
  const status = gameStatusOf(game, phase);
  const scores: ArmyScores = {cho: scoreFor(game, "cho"), han: scoreFor(game, "han")};
  const animated = effects.full;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <PlayerPlaque
        side="han"
        state={plaqueStateOf(status, "han")}
        score={scores.han}
        taken={takenFrom(game, "han")}
        pieceStyle={pieceStyle}
        animated={animated}
      />

      <TurnIndicator status={status} animated={animated} />

      <div className="relative min-h-0 flex-1">
        {children}

        <ResultBanner
          status={status}
          scores={scores}
          animated={animated}
          onStartNewGame={() => {
            onControlPressed();
            dispatch(restarted());
          }}
        />
      </div>

      <PlayerPlaque
        side="cho"
        state={plaqueStateOf(status, "cho")}
        score={scores.cho}
        taken={takenFrom(game, "cho")}
        pieceStyle={pieceStyle}
        animated={animated}
      />

      <div className="flex shrink-0 gap-1.5">
        <UndoButton
          enabled={canUndo(played)}
          onUndo={() => {
            onControlPressed();
            dispatch(takenBack());
          }}
        />

        <RedoButton
          enabled={canRedo(played)}
          onRedo={() => {
            onControlPressed();
            dispatch(playedAgain());
          }}
        />

        <PassButton
          enabled={laidOut && canPass(game)}
          onPass={() => {
            onControlPressed();
            dispatch(passed());
          }}
        />

        <BikjangButton
          enabled={laidOut && canCallBikjang(game)}
          onCall={() => {
            onControlPressed();
            dispatch(bikjangCalled());
          }}
        />

        <SettingsButton
          onOpen={() => {
            onControlPressed();
            onOpenSettings();
          }}
        />
      </div>
    </div>
  );
}
