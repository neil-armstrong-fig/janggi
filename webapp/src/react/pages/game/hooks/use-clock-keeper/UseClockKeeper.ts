import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import {clockActionFor} from "@src/redux/slices/clock/turns/ClockActionFor";
import {clockInUse} from "@src/redux/slices/clock/selecting/ClockInUse";
import {flagDueAt} from "@src/redux/slices/clock/selecting/FlagDueAt";
import {timeRanOut} from "@src/redux/slices/clock/ClockSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEffect, useRef} from "react";

/**
 * Keeps the clock in step with the game. It keys off the page's one moment, as the rating does, and remembers the last
 * id it answered, so a turn is charged once however often the page renders. What a change *means* for the clock is
 * `clockActionFor`'s to say.
 *
 * The store only ever hears of a turn's end, so nothing is dispatched as time passes; the plaque works out what it shows
 * from when the turn began. All that would otherwise go unnoticed is time running out, so one timer waits for that.
 */
export function useClockKeeper(moment: GameMoment | undefined): void {
  const practice = useAppSelector(state => state.tourPractice.parked !== undefined);
  const played = useAppSelector(state => state.game.played);
  const inUse = useAppSelector(state => clockInUse(state) !== undefined);
  const running = useAppSelector(state => state.clock.turnStartedAt !== undefined);
  const flagDue = useAppSelector(flagDueAt);
  const dispatch = useAppDispatch();
  const answeredRef = useRef<number | undefined>(undefined);
  const sideToMove = played.present.sideToMove;

  useEffect(() => {
    if (!moment || answeredRef.current === moment.id) return;

    answeredRef.current = moment.id;

    if (practice) return;

    const action = clockActionFor({change: moment, played, inUse, running}, Date.now());
    if (action) dispatch(action);
  }, [moment, played, inUse, running, practice, dispatch]);

  useEffect(() => {
    if (flagDue === undefined) return undefined;

    const timer = setTimeout(() => dispatch(timeRanOut(sideToMove)), flagDue - Date.now());

    return (): void => {
      clearTimeout(timer);
    };
  }, [flagDue, sideToMove, dispatch]);
}
