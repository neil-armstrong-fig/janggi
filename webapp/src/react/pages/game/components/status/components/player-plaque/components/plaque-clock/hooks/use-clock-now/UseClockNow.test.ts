// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {AppStore} from "@src/redux/Store";
import type {ReactNode} from "react";
import {Provider} from "react-redux";
import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {clockStarted, timeControlChosen, timeRanOut} from "@src/redux/slices/clock/ClockSlice";
import {createElement} from "react";
import {createStore} from "@src/redux/Store";
import {opponentChosen} from "@src/redux/slices/game/GameSlice";
import {useClockNow} from "@src/react/pages/game/components/status/components/player-plaque/components/plaque-clock/hooks/use-clock-now/UseClockNow";

/** What a rendered hook is wrapped in. */
interface WrapperProps {
  readonly children: ReactNode;
}

let store: AppStore;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  store = createStore();
  store.dispatch(opponentChosen("Human"));
  store.dispatch(timeControlChosen("5 min"));
  store.dispatch(clockStarted(1000));
});

afterEach(() => {
  vi.useRealTimers();
});

it("keeps up with the time while the army's clock is running", () => {
  const {result} = renderHook(() => useClockNow("cho"), {wrapper});

  advanceASecond();

  expect(result.current).toBe(2000);
});

it("stands still for the army waiting", () => {
  const {result} = renderHook(() => useClockNow("han"), {wrapper});

  advanceASecond();

  expect(result.current).toBe(1000);
});

it("stops keeping up once the clock stops", () => {
  const {result} = renderHook(() => useClockNow("cho"), {wrapper});

  act(() => {
    store.dispatch(timeRanOut("cho"));
  });
  advanceASecond();

  expect(result.current).toBe(1000);
});

function advanceASecond(): void {
  act(() => {
    vi.advanceTimersByTime(1000);
  });
}

function wrapper({children}: WrapperProps): ReactNode {
  // A .ts file has no JSX, and `createElement`'s third argument does not satisfy the Provider's
  // required `children` prop, so it goes in the props here.
  // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- see above
  return createElement(Provider, {store, children});
}
