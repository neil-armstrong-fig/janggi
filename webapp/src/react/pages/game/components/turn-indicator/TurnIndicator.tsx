import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {sideName} from "@src/react/pages/game/components/utils/SideNames";

/**
 * Whose turn it is.
 *
 * Without it a board waiting for the other army is indistinguishable from one that has stopped
 * responding: your own pieces simply refuse to be picked up and nothing says why.
 *
 * `data-side` rather than the text is the contract with the acceptance tests, so the wording can
 * change without breaking a spec. `aria-live` is what makes the turn passing an announcement rather
 * than a silent change to a line nobody is looking at.
 */
interface Props {
  readonly sideToMove: Side;
}

export function TurnIndicator({sideToMove}: Props): React.JSX.Element {
  return (
    <p
      data-testid="turn"
      data-side={sideToMove}
      aria-live="polite"
      className="shrink-0 text-center text-xs tracking-wide text-white/60 uppercase"
    >
      {sideName(sideToMove)} to move
    </p>
  );
}
