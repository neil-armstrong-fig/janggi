// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {createElement} from "react";
import type {ReactNode} from "react";
import {Provider} from "react-redux";
import {createStore} from "@src/redux/Store";
import {moved, opponentChosen} from "@src/redux/slices/game/GameSlice";
import {tourStarted, onboardingSkipped} from "@src/redux/slices/onboarding/OnboardingSlice";
import {useAppSelector} from "@src/redux/Hooks";
import {useGameMoment} from "@src/react/pages/game/hooks/use-game-moment/UseGameMoment";
import {useRatedGame} from "@src/react/pages/game/hooks/use-rated-game/UseRatedGame";

interface Props {
  readonly children: ReactNode;
}

it("preserves an actual rated game through practice entry, moves and restoration", () => {
  const store = createStore();
  renderHook(
    () => {
      const state = useAppSelector(state => state);
      useRatedGame(useGameMoment(state.game.played, state.tourPractice.parked !== undefined));
    },
    {
      // createElement's third argument does not satisfy Provider's required children prop.
      // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- Provider requires children in these props
      wrapper: ({children}: Props) => createElement(Provider, {store, children}),
    },
  );
  act(() => {
    store.dispatch(moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));
  });
  const ratings = store.getState().ratings;
  expect(ratings.inProgress).toBeDefined();
  act(() => {
    store.dispatch(tourStarted());
  });
  act(() => {
    store.dispatch(moved({from: {file: 3, rank: 7}, to: {file: 3, rank: 6}}));
  });
  expect(store.getState().ratings).toEqual(ratings);
  act(() => {
    store.dispatch(onboardingSkipped());
  });
  expect(store.getState().ratings).toEqual(ratings);
});

it("does not rate practice even if its opponent is changed to a bot", () => {
  const store = createStore();
  store.dispatch(tourStarted());
  renderHook(
    () => {
      const state = useAppSelector(state => state);
      useRatedGame(useGameMoment(state.game.played, state.tourPractice.parked !== undefined));
    },
    {
      // createElement's third argument does not satisfy Provider's required children prop.
      // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- Provider requires children in these props
      wrapper: ({children}: Props) => createElement(Provider, {store, children}),
    },
  );
  act(() => {
    store.dispatch(opponentChosen("Bot"));
  });
  act(() => {
    store.dispatch(moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));
  });
  expect(store.getState().ratings.inProgress).toBeUndefined();
});
