// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {AppStore} from "@src/redux/Store";
import type {ReactNode} from "react";
import {Provider} from "react-redux";
import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {createElement} from "react";
import {createStore} from "@src/redux/Store";
import {moved, opponentChosen} from "@src/redux/game/GameSlice";
import {clockStarted, timeControlChosen} from "@src/redux/clock/ClockSlice";
import {useAppSelector} from "@src/redux/Hooks";
import {useClockKeeper} from "@src/react/pages/game/hooks/use-clock-keeper/UseClockKeeper";
import {useGameMoment} from "@src/react/pages/game/hooks/use-game-moment/UseGameMoment";

/**
 * What a change means for the clock is `clockActionFor`, and what the clock then holds is the slice, each tested beside
 * it. What is tested here is the keeping: each moment answered once, and the one timer waiting for a flag.
 */

/** What a rendered hook is wrapped in. */
interface WrapperProps {
  readonly children: ReactNode;
}

const FRESH = {freeMs: 300_000, periods: 3};

let store: AppStore;

beforeEach(() => {
  vi.useFakeTimers();
  store = createStore();
  store.dispatch(opponentChosen("Human"));
  store.dispatch(timeControlChosen("5 min"));
});

afterEach(() => {
  vi.useRealTimers();
});

it("charges a turn once, however often the page renders", () => {
  const {rerender} = renderKeeper();

  choMoves();
  act(() => {
    vi.advanceTimersByTime(60_000);
  });
  hanMoves();
  rerender();
  rerender();

  expect(store.getState().clock.armies).toEqual({cho: FRESH, han: {freeMs: 240_000, periods: 3}});
});

it("answers a change once, though the clock it started has changed what it read", () => {
  const dispatch = vi.spyOn(store, "dispatch");
  renderKeeper();

  choMoves();

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenLastCalledWith(clockStarted(Date.now()));
});

it("flags the army to move when all its time has gone, and not before", () => {
  renderKeeper();

  choMoves();
  act(() => {
    vi.advanceTimersByTime(389_999);
  });
  expect(store.getState().clock.armies?.han).toEqual(FRESH);

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(store.getState().clock.armies?.han).toEqual({freeMs: 0, periods: 0});
});

it("stops waiting for a flag once the turn has ended", () => {
  const start = Date.now();
  renderKeeper();

  choMoves();
  act(() => {
    vi.advanceTimersByTime(380_000);
  });
  hanMoves();
  act(() => {
    vi.advanceTimersByTime(20_000);
  });

  expect(store.getState().clock.armies?.han).toEqual({freeMs: 0, periods: 1});
  expect(store.getState().clock.turnStartedAt).toBe(start + 380_000);
});

function renderKeeper(): ReturnType<typeof renderHook> {
  return renderHook(
    () => {
      useClockKeeper(useGameMoment(useAppSelector(state => state.game.played)));
    },
    {
      // A .ts file has no JSX, and `createElement`'s third argument does not satisfy the Provider's
      // required `children` prop, so it goes in the props here.
      // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- see above
      wrapper: ({children}: WrapperProps) => createElement(Provider, {store, children}),
    },
  );
}

function choMoves(): void {
  act(() => {
    store.dispatch(moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));
  });
}

function hanMoves(): void {
  act(() => {
    store.dispatch(moved({from: {file: 1, rank: 4}, to: {file: 1, rank: 5}}));
  });
}
