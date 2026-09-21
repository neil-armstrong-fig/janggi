import type {ArmyScores} from "@src/react/pages/game/components/status/components/board-overlay/types/ArmyScores";
import {botEngineRetried} from "@src/redux/bot-engine/BotEngineSlice";
import {botLetOpen, restarted} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {BotEngineNotice} from "@src/react/pages/game/components/status/components/board-overlay/components/bot-engine-notice/BotEngineNotice";
import {BotGoAhead} from "@src/react/pages/game/components/status/components/board-overlay/components/bot-go-ahead/BotGoAhead";
import {RepetitionNotice} from "@src/react/pages/game/components/status/components/board-overlay/components/repetition-notice/RepetitionNotice";
import {ResultBanner} from "@src/react/pages/game/components/status/components/board-overlay/components/result-banner/ResultBanner";
import type {UnknownAction} from "@reduxjs/toolkit";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {repetitionHoldsBackAMove} from "@src/game/repetition/RepetitionHoldsBackAMove";
import {rewardFor} from "@src/react/pages/game/components/status/components/board-overlay/rewards/RewardFor";
import {scoreFor} from "@src/game/scoring/ScoreFor";
import {useGameStatus} from "@src/react/pages/game/components/status/hooks/use-game-status/UseGameStatus";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * What is said over the board rather than around it. Everything here is laid absolutely over the box
 * `Status` puts the board in, so it renders no box of its own.
 *
 * The end of a game is announced here, with what a game against the bot earned. So is the bot holding the
 * game's first move where it plays cho: a button waits over the board until the player lets it start,
 * `botAwaitsGoAhead`, because choosing to play Han should not be what starts a rated game. And so is a
 * bot whose engine is not up: a cover says it is loading, or could not be started and can be tried again,
 * `botEngineHoldsPlay` — and takes the place of the go-ahead button until the engine is ready.
 *
 * Two of janggi's rules surprise a player who knows chess, and both are said in words here. A game
 * ended by a called bikjang explains the call on its announcement. And while the repetition rule holds
 * a move back, a note over the board says so — `repetitionHoldsBackAMove` — since a move that is simply
 * not offered looks like a bug to someone expecting chess's draw.
 *
 * **It reads the game and dispatches for itself**, and is handed only the tick a press makes — the sound
 * being the page's. The announcement and the notices beneath it are handed what they draw: each is a
 * single moment's words, and all of it is worked out once, here.
 */
interface Props {
  readonly onControlPressed: () => void;
}

export function BoardOverlay({onControlPressed}: Props): React.JSX.Element {
  const {played, phase, opponent} = useAppSelector(state => state.game);
  const xp = useAppSelector(state => state.progress.xp);
  const {effects} = usePreferences();
  const {status, botsTurn, awaitingGoAhead, engineHoldsPlay, botEngine} = useGameStatus();
  const dispatch = useAppDispatch();

  const game = played.present;
  const botSide = opponent.name === "Bot" ? opponentOf(opponent.playerSide) : undefined;
  const scores: ArmyScores = {cho: scoreFor(game, "cho"), han: scoreFor(game, "han")};

  // A mate the repetition rule caused is worth the note as much as a move held back mid-game; a result
  // reached any other way has nothing left for the rule to hold back.
  const repetitionHeldBack =
    !botsTurn &&
    !engineHoldsPlay &&
    (status.kind === "toMove" || status.kind === "inCheck" || status.kind === "won") &&
    repetitionHoldsBackAMove(game);

  function pressed(action: UnknownAction): void {
    onControlPressed();
    dispatch(action);
  }

  return (
    <>
      {repetitionHeldBack && <RepetitionNotice />}

      {engineHoldsPlay && <BotEngineNotice botEngine={botEngine} onRetry={() => pressed(botEngineRetried())} />}

      {awaitingGoAhead && !engineHoldsPlay && botSide !== undefined && (
        <BotGoAhead botSide={botSide} onGoAhead={() => pressed(botLetOpen())} />
      )}

      <ResultBanner
        status={status}
        scores={scores}
        bikjangCalledBy={game.bikjangCalled ? game.sideToMove : undefined}
        botSide={botSide}
        reward={rewardFor(status, opponent, phase.format, xp)}
        xp={xp}
        animated={effects.full}
        onStartNewGame={() => pressed(restarted())}
      />
    </>
  );
}
