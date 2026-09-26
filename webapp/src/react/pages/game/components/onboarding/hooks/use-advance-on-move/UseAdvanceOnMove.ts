import {useEffect, useEffectEvent, useRef} from "react";

/**
 * Calls `onMove` when a move is made while `active` — the tour moving on because the player did what it
 * asked. What counts is the record growing, not who moved, and only from the moment it became active: the
 * moves already made when the step came up are not the ones it was waiting for.
 */
export function useAdvanceOnMove(active: boolean, moveCount: number, onMove: () => void): void {
  const moved = useEffectEvent(onMove);
  const seenMovesRef = useRef(moveCount);

  useEffect(() => {
    if (active && moveCount > seenMovesRef.current) moved();

    seenMovesRef.current = moveCount;
  }, [active, moveCount]);
}
