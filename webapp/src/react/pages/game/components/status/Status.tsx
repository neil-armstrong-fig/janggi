import type {ArmyScores} from "@src/react/pages/game/components/status/types/ArmyScores";
import {BoardOverlay} from "@src/react/pages/game/components/status/components/board-overlay/BoardOverlay";
import {Controls} from "@src/react/pages/game/components/status/components/controls/Controls";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlaquePlayer} from "@src/react/pages/game/components/status/types/PlaquePlayer";
import {PlayerPlaque} from "@src/react/pages/game/components/status/components/player-plaque/PlayerPlaque";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {TurnIndicator} from "@src/react/pages/game/components/status/components/turn-indicator/TurnIndicator";
import type {UnknownAction} from "@reduxjs/toolkit";
import {bikjangCalled, botLetOpen, passed, playedAgain, restarted, takenBack} from "@src/redux/game/GameSlice";
import {botAwaitsGoAhead} from "@src/react/pages/game/bot-duty/BotAwaitsGoAhead";
import {botDutyFor} from "@src/react/pages/game/bot-duty/BotDutyFor";
import {gameStatusOf} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import {isArranged} from "@src/game/setups/IsArranged";
import {opponentOf} from "@src/game/utils/OpponentOf";
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
 * — sits under Han's plaque, and `Controls` sit under Cho's, nearest the thumb. Whatever is said over
 * the board itself is `BoardOverlay`.
 *
 * **Against the bot each plaque says who is playing its army** — the bot at the strength it plays at,
 * or the player at their own rating in the format being played.
 *
 * With effects in full the frame answers a change the way the board does: a score counts down to its
 * new value, a lost piece pops into its tray, and the herald bumps as its words change. Every control
 * — the row's, and the buttons over the board — answers a press with a tick through `onControlPressed`,
 * before whatever it does.
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
  const slice = useAppSelector(state => state.game);
  const playerElo = useAppSelector(state => state.ratings.byFormat[state.game.phase.format].elo);
  const {pieceStyle, effects} = usePreferences();
  const {played, phase, opponent} = slice;
  const game = played.present;
  const dispatch = useAppDispatch();

  const botsTurn = botDutyFor(played, phase, opponent) !== undefined;
  const awaitingGoAhead = botAwaitsGoAhead(slice);
  const againstBot = opponent.name === "Bot";
  const botSide = againstBot ? opponentOf(opponent.playerSide) : undefined;
  const status = gameStatusOf(game, phase);
  const scores: ArmyScores = {cho: scoreFor(game, "cho"), han: scoreFor(game, "han")};
  const animated = effects.full;

  // Every control ticks before it does what it does, and all but Settings do it through the store — so
  // each handler below is one call here rather than the tick and the dispatch repeated.
  function pressed(action: UnknownAction): void {
    onControlPressed();
    dispatch(action);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <PlayerPlaque
        side="han"
        state={plaqueStateOf(status, "han")}
        score={scores.han}
        taken={takenFrom(game, "han")}
        pieceStyle={pieceStyle}
        animated={animated}
        player={plaquePlayerFor("han", opponent, playerElo)}
      />

      <TurnIndicator status={status} botToMove={botsTurn && !awaitingGoAhead} animated={animated} />

      <div className="relative min-h-0 flex-1">
        {children}

        <BoardOverlay
          game={game}
          status={status}
          scores={scores}
          botsTurn={botsTurn}
          awaitingGoAhead={awaitingGoAhead}
          botSide={botSide}
          animated={animated}
          onGoAhead={() => pressed(botLetOpen())}
          onStartNewGame={() => pressed(restarted())}
        />
      </div>

      <PlayerPlaque
        side="cho"
        state={plaqueStateOf(status, "cho")}
        score={scores.cho}
        taken={takenFrom(game, "cho")}
        pieceStyle={pieceStyle}
        animated={animated}
        player={plaquePlayerFor("cho", opponent, playerElo)}
      />

      <Controls
        played={played}
        laidOut={isArranged(phase)}
        againstBot={againstBot}
        botsTurn={botsTurn}
        onUndo={() => pressed(takenBack())}
        onRedo={() => pressed(playedAgain())}
        onPass={() => pressed(passed())}
        onCallBikjang={() => pressed(bikjangCalled())}
        onOpenSettings={() => {
          onControlPressed();
          onOpenSettings();
        }}
      />
    </div>
  );
}

/**
 * Who a plaque says is playing its army: against the bot, the bot at its strength or the player at their
 * rating; between two people at one device, nobody.
 */
function plaquePlayerFor(side: Side, opponent: Opponent, playerElo: number): PlaquePlayer | undefined {
  if (opponent.name !== "Bot") return undefined;

  return side === opponent.playerSide ? {kind: "player", elo: playerElo} : {kind: "bot", elo: opponent.botElo};
}
