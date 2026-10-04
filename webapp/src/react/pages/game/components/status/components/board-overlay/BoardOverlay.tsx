import {actInGame} from "@src/redux/online/acting/ActInGame";
import {isAskedToAnswerDraw} from "@src/redux/online/selecting/IsAskedToAnswerDraw";
import {startAnotherGame} from "@src/redux/online/acting/StartAnotherGame";
import type {ArmyScores} from "@src/react/pages/game/components/status/components/board-overlay/types/ArmyScores";
import {botEngineRetried} from "@src/redux/bot-engine/BotEngineSlice";
import {botLetOpen, botStrengthChosen, drawAccepted, drawDeclined} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {BoardPeek} from "@src/react/pages/game/components/status/components/board-overlay/components/board-peek/BoardPeek";
import {BotEngineNotice} from "@src/react/pages/game/components/status/components/board-overlay/components/bot-engine-notice/BotEngineNotice";
import {BotGoAhead} from "@src/react/pages/game/components/status/components/board-overlay/components/bot-go-ahead/BotGoAhead";
import {DrawDeclinedNote} from "@src/react/pages/game/components/status/components/board-overlay/components/draw-declined-note/DrawDeclinedNote";
import {DrawOffer} from "@src/react/pages/game/components/status/components/board-overlay/components/draw-offer/DrawOffer";
import {RepetitionNotice} from "@src/react/pages/game/components/status/components/board-overlay/components/repetition-notice/RepetitionNotice";
import {ResultBanner} from "@src/react/pages/game/components/status/components/board-overlay/components/result-banner/ResultBanner";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {UnknownAction} from "@reduxjs/toolkit";
import {endsAGameByRepetition} from "@janggi/engine/repetition/EndsAGameByRepetition";
import {newlyUnlockedBotElo} from "@src/react/pages/game/components/status/components/board-overlay/rewards/NewlyUnlockedBotElo";
import {opponentOf} from "@janggi/engine/utils/OpponentOf";
import {repetitionHoldsBackAMove} from "@janggi/engine/repetition/RepetitionHoldsBackAMove";
import {rewardFor} from "@src/react/pages/game/components/status/components/board-overlay/rewards/RewardFor";
import {scoreFor} from "@janggi/engine/scoring/ScoreFor";
import {useGameStatus} from "@src/react/pages/game/components/status/hooks/use-game-status/UseGameStatus";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useState} from "react";

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
 * ended by a called bikjang explains the call on its announcement, and so does one ended by a repetition.
 * And while the repetition rule holds a move back, a note over the board says so —
 * `repetitionHoldsBackAMove` — since a move that is simply not offered looks like a bug to someone
 * expecting chess's draw.
 *
 * The announcement can be put aside with Show board, to look at the board it covers, and a tap on the board brings it back
 * (`BoardPeek` says so). That is kept here as the game it was put aside for, so a move taken back ends it, and it is the
 * only thing here that is not derived.
 *
 * A draw on offer is a conversation, and it is held here: the question with its two buttons between two
 * people, and a note where the offer was refused.
 *
 * **It reads the game and dispatches for itself**, and is handed only the tick a press makes — the sound
 * being the page's. The announcement and the notices beneath it are handed what they draw: each is a
 * single moment's words, and all of it is worked out once, here.
 */
interface Props {
  readonly onControlPressed: () => void;
}

export function BoardOverlay({onControlPressed}: Props): React.JSX.Element {
  const {played, phase, opponent, drawOffer} = useAppSelector(state => state.game);
  const {xp, beaten} = useAppSelector(state => state.progress);
  const friend = useAppSelector(state => state.friend);
  const {effects} = usePreferences();
  const {status, botsTurn, awaitingGoAhead, engineHoldsPlay, botEngine} = useGameStatus();
  const dispatch = useAppDispatch();
  const [gamePutAside, setGamePutAside] = useState<typeof played.present>();

  const game = played.present;
  const gameIsOver = status.kind === "won" || status.kind === "wonOnPoints" || status.kind === "drawn";
  const resultPutAside = gameIsOver && gamePutAside === game;
  const botSide = opponent.name === "Bot" ? opponentOf(opponent.playerSide) : undefined;
  const scores: ArmyScores = {cho: scoreFor(game, "cho"), han: scoreFor(game, "han")};

  // A mate the repetition rule caused is worth the note as much as a move held back mid-game; a result
  // reached any other way has nothing left for the rule to hold back.
  const repetitionHeldBack =
    !botsTurn &&
    !engineHoldsPlay &&
    (status.kind === "toMove" || status.kind === "inCheck" || status.kind === "won") &&
    repetitionHoldsBackAMove(game);

  // A checkmate outranks a repetition, so it is only where the game did not end that way that the third
  // standing is what ended it. `outcomeOf` has already said so; this is the one thing it does not say.
  const repetitionEndedIt = status.kind !== "won" && endsAGameByRepetition(game);

  // Between two people an offer waits on the other's tap. Against the bot the answer comes from the bot
  // itself, so there is nobody here to ask — only a refusal to report.
  const offerAwaitsAnAnswer =
    drawOffer !== undefined &&
    !drawOffer.declined &&
    botSide === undefined &&
    // With a friend only the one who was offered the draw is asked (`isAskedToAnswerDraw`).
    isAskedToAnswerDraw(friend, drawOffer.by);
  const offerRefused = drawOffer?.declined ? opponentOf(drawOffer.by) : undefined;

  const nextBotElo = newlyUnlockedBotElo({status, opponent, format: phase.format, beaten});

  function pressed(action: UnknownAction): void {
    onControlPressed();
    dispatch(action);
  }

  function pressedStartAnotherGame(): void {
    onControlPressed();
    dispatch(startAnotherGame());
  }

  // In a game with a friend the room does it, and says so to both: nothing changes here until it does (`actInGame`).
  function pressedInGame(forTheRoom: RoomAction, forThisDevice: UnknownAction): void {
    onControlPressed();
    dispatch(actInGame(forTheRoom, forThisDevice));
  }

  return (
    <>
      {repetitionHeldBack && <RepetitionNotice />}

      {engineHoldsPlay && <BotEngineNotice botEngine={botEngine} onRetry={() => pressed(botEngineRetried())} />}

      {offerRefused && <DrawDeclinedNote decliner={offerRefused} botSide={botSide} />}

      {offerAwaitsAnAnswer && (
        <DrawOffer
          offeredBy={drawOffer.by}
          onAccept={() => pressedInGame({kind: "accept-draw"}, drawAccepted())}
          onDecline={() => pressed(drawDeclined())}
        />
      )}

      {awaitingGoAhead && !engineHoldsPlay && botSide !== undefined && (
        <BotGoAhead botSide={botSide} onGoAhead={() => pressed(botLetOpen())} />
      )}

      {resultPutAside && <BoardPeek onTap={() => setGamePutAside(undefined)} />}

      {!resultPutAside && (
        <ResultBanner
          status={status}
          scores={scores}
          bikjangCalledBy={game.bikjangCalled ? game.sideToMove : undefined}
          repetitionEndedIt={repetitionEndedIt}
          botSide={botSide}
          reward={rewardFor(status, opponent, phase.format, xp)}
          xp={xp}
          animated={effects.full}
          nextBotElo={nextBotElo}
          onShowBoard={() => setGamePutAside(game)}
          onStartNewGame={pressedStartAnotherGame}
          onStartNewGameAtBotElo={elo => pressed(botStrengthChosen(elo))}
        />
      )}
    </>
  );
}
