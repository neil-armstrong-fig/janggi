import type {GameState} from "@src/game/types/GameState";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {GameStatus} from "@src/react/pages/game/components/turn-indicator/utils/GameStatusOf";
import {gameStatusOf} from "@src/react/pages/game/components/turn-indicator/utils/GameStatusOf";
import {sideName} from "@src/react/pages/game/components/utils/SideNames";

/**
 * Whose turn it is, whether their general is under attack, and how the game ended — a checkmate, a
 * win on points once both players have rested a turn, or a draw where a bikjang was called.
 *
 * Without it a board waiting for the other army is indistinguishable from one that has stopped
 * responding: your own pieces simply refuse to be picked up and nothing says why. A mate is the
 * sharper case of the same thing — every piece refuses at once, and only this line says the game is
 * over rather than broken.
 *
 * The attributes rather than the text are the contract with the acceptance tests, so the wording can
 * change without breaking a spec. `aria-live` is what makes the turn passing an announcement rather
 * than a silent change to a line nobody is looking at.
 */
interface Props {
  readonly game: GameState;
  /**
   * How far the board has got in being laid out. It is here rather than derived from `game` because
   * a position cannot say whether anyone chose it — a scored board waiting on Han looks exactly like
   * one both players arranged that way.
   */
  readonly phase: SetupPhase;
}

export function TurnIndicator({game, phase}: Props): React.JSX.Element {
  const status = gameStatusOf(game, phase);
  const winner = winnerOf(status);

  return (
    <p
      data-testid="turn"
      data-side={winner ?? sideOf(status)}
      data-laying-out={status.kind === "layingOut" ? "" : undefined}
      data-in-check={status.kind === "inCheck" ? "" : undefined}
      data-drawn={status.kind === "drawn" ? "" : undefined}
      data-winner={winner}
      aria-live="polite"
      className={`shrink-0 text-center text-xs tracking-wide uppercase ${status.kind === "toMove" ? "text-white/60" : "text-amber-300"}`}
    >
      {announcementOf(status)}
    </p>
  );
}

function announcementOf(status: GameStatus): string {
  switch (status.kind) {
    case "won":
      return `${sideName(status.by)} wins`;
    case "wonOnPoints":
      return `${sideName(status.by)} wins on points`;
    case "drawn":
      return "Drawn by bikjang";
    case "inCheck":
      return `${sideName(status.side)} is in check`;
    case "toMove":
      return `${sideName(status.side)} to move`;
    case "layingOut":
      return `${sideName(status.side)} to lay out`;
  }
}

/** The army that has won, however it won, or undefined while there is still a game to play. */
function winnerOf(status: GameStatus): Side | undefined {
  if (status.kind === "won" || status.kind === "wonOnPoints") return status.by;

  return undefined;
}

/** The army the line is about while there is no result yet — the one to move, or to lay out. */
function sideOf(status: GameStatus): Side | undefined {
  if (status.kind === "toMove" || status.kind === "inCheck" || status.kind === "layingOut") return status.side;

  return undefined;
}
