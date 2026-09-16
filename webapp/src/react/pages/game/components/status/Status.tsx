import {BoardOverlay} from "@src/react/pages/game/components/status/components/board-overlay/BoardOverlay";
import {Controls} from "@src/react/pages/game/components/status/components/controls/Controls";
import {PlayerPlaque} from "@src/react/pages/game/components/status/components/player-plaque/PlayerPlaque";
import {TurnIndicator} from "@src/react/pages/game/components/status/components/turn-indicator/TurnIndicator";

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
 * What is still handed down is what the store does not hold: the board to frame, and the two things the
 * page owns — the tick a control makes when it is pressed, the sound being the page's, and opening the
 * settings sheet, whose open state is the page's too.
 */
interface Props {
  readonly onOpenSettings: () => void;
  readonly onControlPressed: () => void;
  /** The board, which goes between the two plaques. */
  readonly children: React.ReactNode;
}

export function Status({onOpenSettings, onControlPressed, children}: Props): React.JSX.Element {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <PlayerPlaque side="han" />

      <TurnIndicator />

      <div className="relative min-h-0 flex-1">
        {children}

        <BoardOverlay onControlPressed={onControlPressed} />
      </div>

      <PlayerPlaque side="cho" />

      <Controls onControlPressed={onControlPressed} onOpenSettings={onOpenSettings} />
    </div>
  );
}
