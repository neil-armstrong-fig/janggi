import {
  botEngineFailed,
  botEngineLoading,
  botEngineReady,
  botEngineReducer,
  botEngineRetried,
} from "@src/redux/bot-engine/BotEngineSlice";
import type {BotEngineSliceState} from "@src/redux/bot-engine/types/BotEngineSliceState";
import {expect, it} from "vitest";

it("starts with the engine not yet started", () => {
  expect(botEngineReducer(undefined, {type: "unrelated"})).toEqual({status: "idle", reason: undefined});
});

it("is loading once the page has started the engine", () => {
  expect(botEngineReducer(initial(), botEngineLoading())).toEqual({status: "loading", reason: undefined});
});

it("is ready once the engine can be searched", () => {
  const loading = botEngineReducer(initial(), botEngineLoading());

  expect(botEngineReducer(loading, botEngineReady())).toEqual({status: "ready", reason: undefined});
});

it("has failed, with the reason, when the engine could not be started", () => {
  const loading = botEngineReducer(initial(), botEngineLoading());

  expect(botEngineReducer(loading, botEngineFailed("no wasm here"))).toEqual({
    status: "failed",
    reason: "no wasm here",
  });
});

it("goes back to waiting to be started when the player asks to try again, forgetting why it failed", () => {
  const failed = botEngineReducer(initial(), botEngineFailed("no wasm here"));

  expect(botEngineReducer(failed, botEngineRetried())).toEqual({status: "idle", reason: undefined});
});

function initial(): BotEngineSliceState {
  return botEngineReducer(undefined, {type: "unrelated"});
}
