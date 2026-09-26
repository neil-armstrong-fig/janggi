import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {bikjangCalled, drawOffered, passed, playedAgain, takenBack} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {BikjangButton} from "@src/react/pages/game/components/status/components/controls/components/bikjang-button/BikjangButton";
import {DrawButton} from "@src/react/pages/game/components/status/components/controls/components/draw-button/DrawButton";
import {PassButton} from "@src/react/pages/game/components/status/components/controls/components/pass-button/PassButton";
import {RedoButton} from "@src/react/pages/game/components/status/components/controls/components/redo-button/RedoButton";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {SettingsButton} from "@src/react/pages/game/components/status/components/controls/components/settings-button/SettingsButton";
import {UndoButton} from "@src/react/pages/game/components/status/components/controls/components/undo-button/UndoButton";
import type {UnknownAction} from "@reduxjs/toolkit";
import {canAgreeADraw} from "@src/game/drawing/CanAgreeADraw";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {canPass} from "@src/game/passing/CanPass";
import {canRedo} from "@src/game/record/CanRedo";
import {canUndo} from "@src/game/record/CanUndo";
import {isArranged} from "@src/game/setups/IsArranged";
import {useGameStatus} from "@src/react/pages/game/components/status/hooks/use-game-status/UseGameStatus";

/**
 * The row under Cho's plaque, nearest the thumb: every control a player reaches for that is not a move.
 *
 * Resting a turn, calling a bikjang and offering a draw are controls rather than taps on the board
 * because they are the things a player does that touch no intersection. Resting is also the one way out
 * of a position with nothing to play, janggi having no stalemate.
 *
 * Undo and Redo are the only two controls here **not** gated on the game still being undecided —
 * taking back the turn that ended a game is the ordinary reason to reach for one. Against the bot they
 * are off altogether, because that game is rated and a rating that can be taken back is not one.
 *
 * While the game waits on the bot, Pass, Bikjang and Draw are off too: the turn is not the player's to
 * rest, nor the call or the offer theirs to make. Nor is there anything to rest, call or offer on a
 * board still being laid out — the pieces on screen then are only what `boardShownFor` is painting.
 *
 * **It reads the game and dispatches for itself.** What it is handed is only what the store does not
 * hold: the tick every control makes before it acts, the sound being the page's, and opening the settings
 * sheet, whose open state is the page's too.
 *
 * Starting a new game is not in the row. It lives in the settings sheet, beside the format and the
 * setups it deals from, where a stray thumb cannot abandon a game half played — and on the announcement
 * of a result, where there is no game left to abandon.
 */
interface Props {
  readonly onControlPressed: () => void;
}

export function Controls({onControlPressed}: Props): React.JSX.Element {
  const {played, phase, opponent, drawOffer} = useAppSelector(state => state.game);
  const {botsTurn, engineHoldsPlay} = useGameStatus();
  const dispatch = useAppDispatch();

  const game = played.present;
  const againstBot = opponent.name === "Bot";
  const playersTurn = isArranged(phase) && !botsTurn && !engineHoldsPlay;
  const offerWaiting = drawOffer !== undefined && !drawOffer.declined;

  // Every control ticks before it does what it does, so each handler below is one call rather than the
  // tick and the dispatch repeated.
  function pressed(action: UnknownAction): void {
    onControlPressed();
    dispatch(action);
  }

  return (
    <div
      {...tourTarget("controls")}
      className="flex shrink-0 gap-1.5 group-data-[flipped=true]/flip:order-first group-data-[flipped=true]/flip:rotate-180"
    >
      <UndoButton enabled={!againstBot && canUndo(played)} onUndo={() => pressed(takenBack())} />

      <RedoButton enabled={!againstBot && canRedo(played)} onRedo={() => pressed(playedAgain())} />

      <PassButton enabled={playersTurn && canPass(game)} onPass={() => pressed(passed())} />

      <BikjangButton enabled={playersTurn && canCallBikjang(game)} onCall={() => pressed(bikjangCalled())} />

      <DrawButton
        enabled={playersTurn && !offerWaiting && canAgreeADraw(game)}
        onOffer={() => pressed(drawOffered())}
      />

      <SettingsButton
        onOpen={() => {
          onControlPressed();
          dispatch(sheetOpened("settings"));
        }}
      />
    </div>
  );
}
