import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {changeBetween} from "@src/game/record/ChangeBetween";
import {useState} from "react";

/** The record last drawn, and the change that brought it. */
interface Shown {
  readonly played: PlayedGame;
  readonly moment: GameMoment | undefined;
}

/**
 * The most recent change to the game — a turn played, taken back or played again, or a fresh deal —
 * or nothing until the game has changed at all.
 *
 * **Derived, not dispatched.** The store holds a record of positions and no events, and nothing in the
 * engine announces a turn; what changed is read off the record the page was showing against the one
 * it has been handed. That keeps every way the record can change — a tap, a control, a new deal —
 * answered by one mechanism, with nothing to remember to fire.
 *
 * The comparison happens during render, using React's own pattern for adjusting state when a prop
 * changes rather than in an effect. An effect would let the new position paint for one frame before
 * anything knew a piece had moved, which is exactly the flicker a piece in flight must not have.
 *
 * The moment carries an `id` that changes once per change and holds still across every re-render in
 * between — so an effect keyed on it plays a sound or starts a flight once, however often React
 * renders or re-runs effects.
 */
export function useGameMoment(played: PlayedGame): GameMoment | undefined {
  const [shown, setShown] = useState<Shown>({played, moment: undefined});

  if (shown.played !== played) {
    const moment: GameMoment = {id: (shown.moment?.id ?? 0) + 1, ...changeBetween(shown.played, played)};
    setShown({played, moment});

    return moment;
  }

  return shown.moment;
}
