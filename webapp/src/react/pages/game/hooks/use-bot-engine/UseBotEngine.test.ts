// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {AppStore} from "@src/redux/Store";
import type {Engine} from "@src/bot/engine/types/Engine";
import type {Mock} from "vitest";
import type {ReactNode} from "react";
import {Provider} from "react-redux";
import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {botEngineRetried} from "@src/redux/bot-engine/BotEngineSlice";
import {createElement} from "react";
import {createStore} from "@src/redux/Store";
import {opponentChosen} from "@src/redux/game/GameSlice";
import {useBotEngine} from "@src/react/pages/game/hooks/use-bot-engine/UseBotEngine";

/**
 * When the engine is started and what is said of it. The app opens against the bot, so the store begins
 * there, and the engine is a fake that remembers how often it was asked to prepare.
 */

/** An engine that remembers how often it was asked to start. */
interface PreparedEngine extends Engine {
  readonly prepare: Mock<Engine["prepare"]>;
}

/** What a rendered hook is wrapped in. */
interface WrapperProps {
  readonly children: ReactNode;
}

let store: AppStore;

beforeEach(() => {
  vi.useFakeTimers();
  store = createStore();
});

afterEach(() => {
  vi.useRealTimers();
});

it("starts nothing while the page is still settling", async () => {
  const engine = engineStarting();

  renderOn(engine);
  await act(() => vi.advanceTimersByTimeAsync(1_499));

  expect(engine.prepare).not.toHaveBeenCalled();
});

it("starts the engine once the page has settled, and says it is ready when it is", async () => {
  const engine = engineStarting();

  renderOn(engine);
  await act(() => vi.advanceTimersByTimeAsync(1_500));

  expect(engine.prepare).toHaveBeenCalledTimes(1);
  expect(store.getState().botEngine.status).toBe("ready");
});

it("starts nothing in a game against a person, however long the page has been open", async () => {
  const engine = engineStarting();
  store.dispatch(opponentChosen("Human"));

  renderOn(engine);
  await act(() => vi.advanceTimersByTimeAsync(10_000));

  expect(engine.prepare).not.toHaveBeenCalled();
});

it("starts the engine at once when the bot is chosen after the page has settled", async () => {
  const engine = engineStarting();
  store.dispatch(opponentChosen("Human"));
  renderOn(engine);
  await act(() => vi.advanceTimersByTimeAsync(10_000));

  await act(() => {
    store.dispatch(opponentChosen("Bot"));
  });

  expect(engine.prepare).toHaveBeenCalledTimes(1);
});

it("says the bot could not be started, with why, when the engine fails to start", async () => {
  const engine = engineFailingWith(new Error("The engine did not start in time"));

  renderOn(engine);
  await act(() => vi.advanceTimersByTimeAsync(1_500));

  expect(store.getState().botEngine).toEqual({status: "failed", reason: "The engine did not start in time"});
});

it("starts the engine again at once when the player asks to try again", async () => {
  const engine = engineFailingWith(new Error("The engine did not start in time"));
  renderOn(engine);
  await act(() => vi.advanceTimersByTimeAsync(1_500));

  await act(() => {
    store.dispatch(botEngineRetried());
  });

  expect(engine.prepare).toHaveBeenCalledTimes(2);
});

function renderOn(engine: Engine): void {
  renderHook(
    () => {
      useBotEngine(engine);
    },
    {
      // A .ts file has no JSX, and `createElement`'s third argument does not satisfy the Provider's
      // required `children` prop, so it goes in the props here.
      // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- see above
      wrapper: ({children}: WrapperProps) => createElement(Provider, {store, children}),
    },
  );
}

function engineStarting(): PreparedEngine {
  return {
    prepare: vi.fn(() => Promise.resolve()),
    search: () => Promise.reject(new Error("unused")),
    stop: () => undefined,
  };
}

function engineFailingWith(error: Error): PreparedEngine {
  return {
    prepare: vi.fn(() => Promise.reject(error)),
    search: () => Promise.reject(new Error("unused")),
    stop: () => undefined,
  };
}
