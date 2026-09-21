// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {AppStore} from "@src/redux/Store";
import type {Engine} from "@src/bot/engine/types/Engine";
import type {ReactNode} from "react";
import type {SearchResult} from "@src/bot/engine/types/SearchResult";
import {Provider} from "react-redux";
import type {Mock} from "vitest";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {botEngineLoading, botEngineReady} from "@src/redux/bot-engine/BotEngineSlice";
import {botLetOpen, sideChosen} from "@src/redux/game/GameSlice";
import {createElement} from "react";
import {createStore} from "@src/redux/Store";
import {renderHook, waitFor} from "@testing-library/react";
import {useBotOpponent} from "@src/react/pages/game/hooks/use-bot-opponent/UseBotOpponent";

/**
 * What the page does with the bot's turn is `botDutyFor` and `botReplyFor`, each tested beside it. What
 * is tested here is only when the engine is asked, and what is said when it cannot answer — so the game
 * is set to the bot's own turn, cho's first move, and the engine is a fake that remembers being asked.
 */

/** An engine that remembers how often it was asked to search. */
interface AskedEngine extends Engine {
  readonly search: Mock<Engine["search"]>;
}

/** What a rendered hook is wrapped in. */
interface WrapperProps {
  readonly children: ReactNode;
}

let store: AppStore;

beforeEach(() => {
  store = createStore();
  store.dispatch(sideChosen("Han"));
  store.dispatch(botLetOpen());
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("asks the engine nothing while it has not been started", () => {
  const engine = engineAnswering({bestMove: "", evaluation: undefined});

  renderOn(engine);

  expect(engine.search).not.toHaveBeenCalled();
});

it("asks the engine nothing while it is still loading", () => {
  const engine = engineAnswering({bestMove: "", evaluation: undefined});
  store.dispatch(botEngineLoading());

  renderOn(engine);

  expect(engine.search).not.toHaveBeenCalled();
});

it("asks the engine for the bot's turn as soon as it is ready", async () => {
  const engine = engineAnswering({bestMove: "", evaluation: undefined});
  renderOn(engine);

  store.dispatch(botEngineReady());

  await waitFor(() => expect(engine.search).toHaveBeenCalled());
});

it("says the bot could not be started when the engine fails to answer, with why", async () => {
  const engine = engineFailingWith(new Error("The engine did not answer the search"));
  store.dispatch(botEngineReady());

  renderOn(engine);

  await waitFor(() =>
    expect(store.getState().botEngine).toEqual({status: "failed", reason: "The engine did not answer the search"}),
  );
});

function renderOn(engine: Engine): void {
  renderHook(
    () => {
      useBotOpponent(engine);
    },
    {
      // A .ts file has no JSX, and `createElement`'s third argument does not satisfy the Provider's
      // required `children` prop, so it goes in the props here.
      // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- see above
      wrapper: ({children}: WrapperProps) => createElement(Provider, {store, children}),
    },
  );
}

function engineAnswering(result: SearchResult): AskedEngine {
  return {prepare: () => Promise.resolve(), search: vi.fn(() => Promise.resolve(result)), stop: () => undefined};
}

function engineFailingWith(error: Error): Engine {
  return {prepare: () => Promise.resolve(), search: () => Promise.reject(error), stop: () => undefined};
}
