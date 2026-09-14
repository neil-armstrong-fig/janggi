import type {GameState} from "@src/game/types/GameState";
import {LinesOverlay} from "@src/react/pages/game/components/board/components/lines-overlay/LinesOverlay";
import {bikjangLineIn} from "@src/react/pages/game/components/board/components/bikjang-line/utils/BikjangLineIn";

/**
 * A called bikjang, drawn in gold down the open file between the two generals. Nothing at all until one
 * has been called.
 *
 * Keyed by the change that is showing, as the lines of a check are, so it is drawn out as the call is made.
 */
interface Props {
  readonly game: GameState;
  /** The id of the most recent change to the game. */
  readonly momentId: number;
  readonly drawing: boolean;
}

export function BikjangLine({game, momentId, drawing}: Props): React.JSX.Element | null {
  const line = bikjangLineIn(game);
  if (!line) return null;

  return <LinesOverlay key={momentId} testId="bikjang-line" lines={[line]} tone="gold" drawing={drawing} />;
}
