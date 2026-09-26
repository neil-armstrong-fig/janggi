import {BoardOverlay} from "@src/react/pages/game/components/status/components/board-overlay/BoardOverlay";
import {Controls} from "@src/react/pages/game/components/status/components/controls/Controls";
import {PlayerPlaque} from "@src/react/pages/game/components/status/components/player-plaque/PlayerPlaque";
import {boardFlippedForHan} from "@src/react/pages/game/components/status/utils/BoardFlippedForHan";
import {TurnIndicator} from "@src/react/pages/game/components/status/components/turn-indicator/TurnIndicator";
import {useAppSelector} from "@src/redux/Hooks";
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
 * **It is layout, and only layout.** Each part of the frame reads what it draws from the store and
 * dispatches for itself — the plaques, the herald, the controls and the overlay — so nothing here selects
 * a dozen values only to thread them down, and a part that needs something new asks for it where it is
 * used. The one question several of them share, what the game is doing right now, they each ask through
 * `useGameStatus`, so they cannot disagree about it.
 *
 * **It can turn the game to face Han's player.** Where the player has asked for the board flipped for
 * Han and is playing a person, it marks the frame `data-flipped` while it is Han's move, and the pieces
 * and the words that are meant to be read — the plaques and the herald — turn half a turn where they
 * stand. The controls go to the top edge, turned the same way, where Han's player can reach them. The board itself stays put, so each army stays on its own player's side of the device: Han's
 * player, sat across, reads the pieces upright without reaching over to the far end.
 *
 * What is still handed down is what the store does not hold: the board to frame, and the two things the
 * page owns — the tick a control makes when it is pressed, the sound being the page's, and opening the
 * settings sheet, whose open state is the page's too.
 */
interface Props {
  readonly onControlPressed: () => void;
  /** The board, which goes between the two plaques. */
  readonly children: React.ReactNode;
}

export function Status({onControlPressed, children}: Props): React.JSX.Element {
  const {flipBoardForHan} = usePreferences();
  const opponent = useAppSelector(state => state.game.opponent);
  const sideToMove = useAppSelector(state => state.game.played.present.sideToMove);
  const flipped = boardFlippedForHan(flipBoardForHan, opponent, sideToMove);

  return (
    <div data-flipped={flipped} className="group/flip flex min-h-0 flex-1 flex-col gap-1.5">
      <PlayerPlaque side="han" />

      <TurnIndicator />

      <div className="relative min-h-0 flex-1">
        {children}

        <BoardOverlay onControlPressed={onControlPressed} />
      </div>

      <PlayerPlaque side="cho" />

      <Controls onControlPressed={onControlPressed} />
    </div>
  );
}
