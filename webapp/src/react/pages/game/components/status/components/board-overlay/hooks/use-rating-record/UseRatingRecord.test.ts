// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {ReactNode} from "react";
import {Provider} from "react-redux";
import {act, renderHook} from "@testing-library/react";
import {createElement} from "react";
import {createStore} from "@src/redux/Store";
import {ratedGameFinished, ratedGameStarted} from "@src/redux/slices/ratings/RatingsSlice";
import {expect, it} from "vitest";
import {useRatingRecord} from "@src/react/pages/game/components/status/components/board-overlay/hooks/use-rating-record/UseRatingRecord";

interface Props {
  readonly children: ReactNode;
}

it("returns the rating entry linked to the bot game on the board", () => {
  const store = createStore();
  const wrapper = ({children}: Props): ReturnType<typeof createElement> => {
    // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- Provider requires children in these props
    return createElement(Provider, {store, children});
  };
  const hook = renderHook(() => useRatingRecord(), {wrapper});

  act(() => {
    store.dispatch(ratedGameStarted({format: "Casual", botElo: 800, playerSide: "cho", startedAt: "start"}));
    store.dispatch(ratedGameFinished({result: "won", ending: "checkmate", finishedAt: "finish"}));
  });

  expect(hook.result.current).toMatchObject({finishedAt: "finish", eloBefore: 1200});
});

it("returns no record when the game has not been rated", () => {
  const store = createStore();
  const wrapper = ({children}: Props): ReturnType<typeof createElement> => {
    // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- Provider requires children in these props
    return createElement(Provider, {store, children});
  };

  const hook = renderHook(() => useRatingRecord(), {wrapper});

  expect(hook.result.current).toBeUndefined();
});
