import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {GameState} from "@src/game/types/GameState";
import type {Vector} from "@src/react/pages/game/components/board/types/Vector";
import {endsTheGame} from "@src/react/pages/game/components/board/hooks/use-ending-shake/utils/EndsTheGame";
import {useEffect, useEffectEvent, useRef} from "react";

/** The change to answer, the game it left standing, whether motion is shown, and what shakes the board. */
export interface EndingShake {
  readonly moment: GameMoment | undefined;
  readonly game: GameState;
  readonly animated: boolean;
  readonly shake: (impulse: Vector) => void;
}

/**
 * Shakes the board as a game ends, whatever ended it — a game's ending is felt. Only while effects are in
 * full, and once for the change that ended it, however often the effect re-runs.
 */
export function useEndingShake({moment, game, animated, shake}: EndingShake): void {
  const shookForRef = useRef(0);

  const shakeIfEnded = useEffectEvent((changed: GameMoment) => {
    if (!animated || changed.id <= shookForRef.current || !endsTheGame(changed, game)) return;

    shookForRef.current = changed.id;
    shake(ENDING_IMPULSE);
  });

  useEffect(() => {
    if (moment) shakeIfEnded(moment);
  }, [moment]);
}

/** The blow a game's ending gives the board: straight down, and a touch harder than a chariot taken. */
const ENDING_IMPULSE: Vector = {x: 0, y: 2.4};
