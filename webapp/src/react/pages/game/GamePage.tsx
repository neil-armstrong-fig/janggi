import {BikjangButton} from "@src/react/pages/game/components/bikjang-button/BikjangButton";
import {Board} from "@src/react/pages/game/components/board/Board";
import {
  BUILT_IN_PIECE_STYLES,
  DEFAULT_PIECE_STYLE,
} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {BUILT_IN_STYLES, DEFAULT_STYLE} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {SETUPS} from "@src/game/setups/Setups";
import {NewGameButton} from "@src/react/pages/game/components/new-game-button/NewGameButton";
import {DEFAULT_MOVABLE_HIGHLIGHT, MOVABLE_HIGHLIGHTS} from "@src/react/pages/game/utils/MovableHighlights";
import {MATCH_FORMAT_OPTIONS} from "@src/react/pages/game/utils/MatchFormats";
import type {MovableHighlight} from "@src/react/pages/game/types/MovableHighlight";
import {OptionPicker} from "@src/react/pages/game/components/option-picker/OptionPicker";
import {TurnIndicator} from "@src/react/pages/game/components/turn-indicator/TurnIndicator";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import {PassButton} from "@src/react/pages/game/components/pass-button/PassButton";
import {RedoButton} from "@src/react/pages/game/components/redo-button/RedoButton";
import {Scoreboard} from "@src/react/pages/game/components/scoreboard/Scoreboard";
import {UndoButton} from "@src/react/pages/game/components/undo-button/UndoButton";
import {canCallBikjang} from "@src/game/CanCallBikjang";
import {canPass} from "@src/game/CanPass";
import {canRedo} from "@src/game/record/CanRedo";
import {canUndo} from "@src/game/record/CanUndo";
import {
  bikjangCalled,
  choSetupChosen,
  formatChosen,
  hanSetupChosen,
  moved,
  passed,
  playedAgain,
  restarted,
  takenBack,
} from "@src/redux/game/GameSlice";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useState} from "react";

/**
 * The screen a game is played on. It owns which style the board and pieces are wearing, and how
 * each army is arranged — nothing else about how any of it looks, which belongs to the cells and
 * the pieces themselves.
 *
 * The two armies get a control each because they genuinely choose separately: Han lays out first,
 * Cho answers, and whether the elephants end up on the same wing or facing each other across the
 * board is the result of those two choices rather than of one setting. See `Setups.ts`.
 *
 * The game itself comes from the store; the board style and the piece set stay in local state,
 * because those are preferences about how the game is drawn rather than part of the game.
 *
 * Resting a turn and calling a bikjang are controls rather than gestures on the board, because they
 * are the two things a player does that touch no intersection. Resting is also the one way out of a
 * position with nothing to play, janggi having no stalemate.
 *
 * Which of janggi's two games is being played is a picker beside the setups rather than beside the
 * board style, because it is not a preference about how the game is drawn: it decides whether a
 * bikjang may be called at all and whether one draws. Like a back rank it is settled before play,
 * so it locks on the same question the setups do.
 *
 * The controls row wraps, because six of them and a scoreboard do not fit across a phone.
 */
export function GamePage(): React.JSX.Element {
  const [style, setStyle] = useState<BoardStyle>(DEFAULT_STYLE);
  const [pieceStyle, setPieceStyle] = useState<PieceSetStyle>(DEFAULT_PIECE_STYLE);
  const [movableHighlight, setMovableHighlight] = useState<MovableHighlight>(DEFAULT_MOVABLE_HIGHLIGHT);
  const {played, hanSetup, choSetup, format} = useAppSelector(state => state.game);
  const game = played.present;
  const dispatch = useAppDispatch();

  return (
    <main className="flex h-full w-full flex-col gap-3 bg-[#1c140b] p-2">
      <div className="flex shrink-0 flex-col items-center gap-1">
        <TurnIndicator game={game} />

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Scoreboard game={game} />

          <PassButton enabled={canPass(game)} onPass={() => dispatch(passed())} />

          <BikjangButton enabled={canCallBikjang(game)} onCall={() => dispatch(bikjangCalled())} />

          <UndoButton enabled={canUndo(played)} onUndo={() => dispatch(takenBack())} />

          <RedoButton enabled={canRedo(played)} onRedo={() => dispatch(playedAgain())} />

          <NewGameButton onStart={() => dispatch(restarted())} />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <Board
          game={game}
          style={style}
          pieceStyle={pieceStyle}
          highlightMovable={movableHighlight.shown}
          onMove={move => dispatch(moved(move))}
        />
      </div>

      {/* Capped and scrollable rather than shrink-0: six rows of pills are taller than a short
          window has to spare, and settings that push the board off the top of the screen are worse
          than settings you have to scroll to. A real settings screen is what actually fixes this. */}
      <div data-testid="settings" className="flex max-h-[45%] shrink-0 flex-col gap-2 overflow-y-auto">
        <OptionPicker id="board-style" label="Board" options={BUILT_IN_STYLES} selected={style} onSelect={setStyle} />

        <OptionPicker
          id="piece-style"
          label="Pieces"
          options={BUILT_IN_PIECE_STYLES}
          selected={pieceStyle}
          onSelect={setPieceStyle}
        />

        <OptionPicker
          id="movable-highlight"
          label="Moves"
          ariaLabel="Highlight the pieces that can move"
          options={MOVABLE_HIGHLIGHTS}
          selected={movableHighlight}
          onSelect={setMovableHighlight}
        />

        <OptionPicker
          id="match-format"
          disabled={playHasBegun(played)}
          label="Format"
          ariaLabel="Which of janggi's two games is being played"
          options={MATCH_FORMAT_OPTIONS}
          selected={{name: format}}
          onSelect={option => dispatch(formatChosen(option.name))}
        />

        <OptionPicker
          id="han-setup"
          disabled={playHasBegun(played)}
          label="Han"
          ariaLabel="Han's opening setup"
          options={SETUPS}
          selected={hanSetup}
          onSelect={setup => dispatch(hanSetupChosen(setup))}
        />

        <OptionPicker
          id="cho-setup"
          disabled={playHasBegun(played)}
          label="Cho"
          ariaLabel="Cho's opening setup"
          options={SETUPS}
          selected={choSetup}
          onSelect={setup => dispatch(choSetupChosen(setup))}
        />
      </div>
    </main>
  );
}
