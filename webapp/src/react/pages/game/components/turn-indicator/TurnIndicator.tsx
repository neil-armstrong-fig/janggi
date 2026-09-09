import type {GameState} from "@src/game/types/GameState";
import type {GameStatus} from "@src/react/pages/game/components/turn-indicator/utils/GameStatusOf";
import {gameStatusOf} from "@src/react/pages/game/components/turn-indicator/utils/GameStatusOf";
import {sideName} from "@src/react/pages/game/components/utils/SideNames";

/**
 * Whose turn it is, whether their general is under attack, and who won.
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

  return (
    <p
      data-testid="turn"
      data-side={status.kind === "won" ? status.by : status.side}
      data-in-check={status.kind === "inCheck" ? "" : undefined}
      data-winner={status.kind === "won" ? status.by : undefined}
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
    case "inCheck":
      return `${sideName(status.side)} is in check`;
    case "toMove":
      return `${sideName(status.side)} to move`;
  }
}
