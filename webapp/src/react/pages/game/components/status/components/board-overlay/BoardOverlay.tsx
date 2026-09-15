import type {ArmyScores} from "@src/react/pages/game/components/status/types/ArmyScores";
import {BotGoAhead} from "@src/react/pages/game/components/status/components/board-overlay/components/bot-go-ahead/BotGoAhead";
import type {GameState} from "@src/game/types/GameState";
import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import {RepetitionNotice} from "@src/react/pages/game/components/status/components/board-overlay/components/repetition-notice/RepetitionNotice";
import {ResultBanner} from "@src/react/pages/game/components/status/components/board-overlay/components/result-banner/ResultBanner";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {repetitionHoldsBackAMove} from "@src/game/repetition/RepetitionHoldsBackAMove";

/**
 * What is said over the board rather than around it. Everything here is laid absolutely over the box
 * `Status` puts the board in, so it renders no box of its own.
 *
 * The end of a game is announced here. So is the bot holding the game's first move where it plays cho:
 * a button waits over the board until the player lets it start, `botAwaitsGoAhead`, because choosing to
 * play Han should not be what starts a rated game.
 *
 * Two of janggi's rules surprise a player who knows chess, and both are said in words here. A game
 * ended by a called bikjang explains the call on its announcement. And while the repetition rule holds
 * a move back, a note over the board says so — `repetitionHoldsBackAMove` — since a move that is simply
 * not offered looks like a bug to someone expecting chess's draw.
 */
interface Props {
  readonly game: GameState;
  readonly status: GameStatus;
  readonly scores: ArmyScores;
  readonly botsTurn: boolean;
  /** Whether the bot is holding the game's first move until the player lets it start. */
  readonly awaitingGoAhead: boolean;
  readonly botSide: Side | undefined;
  readonly animated: boolean;
  readonly onGoAhead: () => void;
  readonly onStartNewGame: () => void;
}

export function BoardOverlay({
  game,
  status,
  scores,
  botsTurn,
  awaitingGoAhead,
  botSide,
  animated,
  onGoAhead,
  onStartNewGame,
}: Props): React.JSX.Element {
  // A mate the repetition rule caused is worth the note as much as a move held back mid-game; a result
  // reached any other way has nothing left for the rule to hold back.
  const repetitionHeldBack =
    !botsTurn &&
    (status.kind === "toMove" || status.kind === "inCheck" || status.kind === "won") &&
    repetitionHoldsBackAMove(game);

  return (
    <>
      {repetitionHeldBack && <RepetitionNotice />}

      {awaitingGoAhead && botSide !== undefined && <BotGoAhead botSide={botSide} onGoAhead={onGoAhead} />}

      <ResultBanner
        status={status}
        scores={scores}
        bikjangCalledBy={game.bikjangCalled ? game.sideToMove : undefined}
        botSide={botSide}
        animated={animated}
        onStartNewGame={onStartNewGame}
      />
    </>
  );
}
