import {LinesOverlay} from "@src/react/pages/game/components/board/components/lines-overlay/LinesOverlay";
import type {Threat} from "@src/react/pages/game/components/board/types/Threat";
import {checkLinesOf} from "@src/react/pages/game/components/board/components/check-lines/utils/CheckLinesOf";

/**
 * The lines of a check, drawn across the board in the danger colour from each piece giving it to the
 * general under attack. Nothing at all while no general is attacked.
 *
 * Keyed by the change that is showing, so a check given again by a later move is drawn out afresh rather
 * than left standing as it was.
 */
interface Props {
  readonly threat: Threat | undefined;
  /** The id of the most recent change to the game. */
  readonly momentId: number;
  readonly drawing: boolean;
}

export function CheckLines({threat, momentId, drawing}: Props): React.JSX.Element | null {
  if (!threat) return null;

  return (
    <LinesOverlay key={momentId} testId="check-lines" lines={checkLinesOf(threat)} tone="danger" drawing={drawing} />
  );
}
