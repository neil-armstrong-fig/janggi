import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {ElephantPairingLine} from "@src/react/pages/game/components/settings/components/elephant-pairing/ElephantPairingLine";
import {MATCH_FORMAT_OPTIONS} from "@src/react/pages/game/components/settings/utils/MatchFormats";
import {MOVABLE_HIGHLIGHTS} from "@src/react/pages/game/utils/MovableHighlights";
import type {MovableHighlight} from "@src/react/pages/game/types/MovableHighlight";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import {SETUPS} from "@src/game/setups/Setups";
import {canPlace} from "@src/game/setups/CanPlace";
import {choSetupChosen, formatChosen, hanSetupChosen} from "@src/redux/game/GameSlice";
import {playHasBegun} from "@src/react/pages/game/components/settings/utils/PlayHasBegun";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Everything a player may choose about the game and about how it is drawn.
 *
 * The two armies get a picker each because they genuinely choose separately: Han lays out first,
 * Cho answers, and whether the elephants end up on the same wing or facing each other across the
 * board is the result of those two choices rather than of one setting. See `Setups.ts`, and the
 * line under the two pickers, which names that pairing where the game has a name for it.
 *
 * In a **scored** game that order is a rule — `docs/rules.md` §6.6 — so the two pickers open empty,
 * Cho's waits for Han, and Han's closes the moment it is used. In a **casual** game none of that
 * applies: the pieces are simply dealt on the common arrangement and either army may be re-chosen
 * until the first move. The rule itself is `canPlace`.
 *
 * Which of janggi's two games is being played is a picker beside the setups rather than beside the
 * board style, because it is not a preference about how the game is drawn: it decides whether a
 * bikjang may be called at all and whether one draws. Like a back rank it is settled before play,
 * so it locks on the same question the setups do.
 *
 * That is the split running through this panel. The three settings that are part of the *game* are
 * dealt through the store and lock on `playHasBegun`; the three above them are preferences about
 * how a game is drawn, so they stay in `GamePage`'s own state and arrive here as props — the board
 * is wearing them too, and they never restart anything.
 */
interface Props {
  readonly style: BoardStyle;
  readonly onSelectStyle: (style: BoardStyle) => void;
  readonly pieceStyle: PieceSetStyle;
  readonly onSelectPieceStyle: (pieceStyle: PieceSetStyle) => void;
  readonly movableHighlight: MovableHighlight;
  readonly onSelectMovableHighlight: (movableHighlight: MovableHighlight) => void;
}

export function Settings({
  style,
  onSelectStyle,
  pieceStyle,
  onSelectPieceStyle,
  movableHighlight,
  onSelectMovableHighlight,
}: Props): React.JSX.Element {
  const {played, phase} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  return (
    /* Capped and scrollable rather than shrink-0: six rows of pills are taller than a short
       window has to spare, and settings that push the board off the top of the screen are worse
       than settings you have to scroll to. A real settings screen is what actually fixes this. */
    <div data-testid="settings" className="flex max-h-[45%] shrink-0 flex-col gap-2 overflow-y-auto">
      <OptionPicker
        id="board-style"
        label="Board"
        options={BUILT_IN_STYLES}
        selected={style}
        onSelect={onSelectStyle}
      />

      <OptionPicker
        id="piece-style"
        label="Pieces"
        options={BUILT_IN_PIECE_STYLES}
        selected={pieceStyle}
        onSelect={onSelectPieceStyle}
      />

      <OptionPicker
        id="movable-highlight"
        label="Moves"
        ariaLabel="Highlight the pieces that can move"
        options={MOVABLE_HIGHLIGHTS}
        selected={movableHighlight}
        onSelect={onSelectMovableHighlight}
      />

      <OptionPicker
        id="match-format"
        disabled={playHasBegun(played)}
        label="Format"
        ariaLabel="Which of janggi's two games is being played"
        options={MATCH_FORMAT_OPTIONS}
        selected={{name: phase.format}}
        onSelect={option => dispatch(formatChosen(option.name))}
      />

      <OptionPicker
        id="han-setup"
        disabled={playHasBegun(played) || !canPlace(phase, "han")}
        label="Han"
        ariaLabel="Han's opening setup"
        options={SETUPS}
        selected={phase.hanSetup}
        onSelect={setup => dispatch(hanSetupChosen(setup))}
      />

      <OptionPicker
        id="cho-setup"
        disabled={playHasBegun(played) || !canPlace(phase, "cho")}
        label="Cho"
        ariaLabel="Cho's opening setup"
        options={SETUPS}
        selected={phase.choSetup}
        onSelect={setup => dispatch(choSetupChosen(setup))}
      />

      <ElephantPairingLine hanSetup={phase.hanSetup} choSetup={phase.choSetup} />
    </div>
  );
}
