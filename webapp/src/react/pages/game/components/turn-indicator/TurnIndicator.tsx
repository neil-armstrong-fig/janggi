import type {GameState} from "@src/game/types/GameState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {GameStatus} from "@src/react/pages/game/components/turn-indicator/utils/GameStatusOf";
import {gameStatusOf} from "@src/react/pages/game/components/turn-indicator/utils/GameStatusOf";
import {sideName} from "@src/react/pages/game/components/utils/SideNames";

/**
 * Whose turn it is, whether their general is under attack, and who won — by checkmate, or on points
 * once both players have rested a turn.
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
}

export function TurnIndicator({game}: Props): React.JSX.Element {
  const status = gameStatusOf(game);
  const winner = winnerOf(status);

  return (
    <p
      data-testid="turn"
      data-side={winner ?? sideOf(status)}
      data-in-check={status.kind === "inCheck" ? "" : undefined}
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
    case "inCheck":
      return `${sideName(status.side)} is in check`;
    case "toMove":
      return `${sideName(status.side)} to move`;
  }
}

/** The army that has won, however it won, or undefined while there is still a game to play. */
function winnerOf(status: GameStatus): Side | undefined {
  if (status.kind === "won" || status.kind === "wonOnPoints") return status.by;

  return undefined;
}

/** The army the line is about while the game is still going, which is the one to move. */
function sideOf(status: GameStatus): Side | undefined {
  if (status.kind === "toMove" || status.kind === "inCheck") return status.side;

  return undefined;
}
