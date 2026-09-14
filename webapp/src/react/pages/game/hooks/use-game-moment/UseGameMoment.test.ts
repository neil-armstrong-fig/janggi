// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {Move} from "@src/game/types/Move";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {beforeEach, describe, expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {renderHook} from "@testing-library/react";
import {undo} from "@src/game/record/Undo";
import {useGameMoment} from "@src/react/pages/game/hooks/use-game-moment/UseGameMoment";

/**
 * What changed is the engine's `changeBetween` to decide, and `game/record/ChangeBetween.test.ts` covers every case of it.
 * What is left for the hook is the part a pure function cannot have: remembering what was last shown,
 * and handing out one moment per change however many times it is rendered.
 *
 * Nested, each level doing one thing to the game its parent left behind.
 */

const SOLDIER_STEP: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};

let hook: Rendered;
let firstMoment: GameMoment | undefined;

describe("a game that has not changed", () => {
  beforeEach(() => {
    hook = renderOn(opening());
  });

  it("has nothing to show", () => {
    expect(hook.result.current).toBeUndefined();
  });

  it("still has nothing to show when rendered again with the same record", () => {
    hook.rerender({played: hook.played});

    expect(hook.result.current).toBeUndefined();
  });

  describe("when a move is played", () => {
    beforeEach(() => {
      hook.show(playMove(hook.played, SOLDIER_STEP));
      firstMoment = hook.result.current;
    });

    it("shows the move, the render it arrives in", () => {
      expect(firstMoment).toMatchObject({direction: "advanced", transition: {move: SOLDIER_STEP}});
    });

    /** An effect keyed on the id must not fire twice for one move because React rendered twice. */
    it("keeps the very same moment when rendered again with nothing changed", () => {
      hook.rerender({played: hook.played});

      expect(hook.result.current).toBe(firstMoment);
    });

    describe("and then taken back", () => {
      beforeEach(() => {
        hook.show(undo(hook.played));
      });

      it("shows the take-back", () => {
        expect(hook.result.current).toMatchObject({direction: "takenBack", transition: {move: SOLDIER_STEP}});
      });

      it("gives it an id of its own", () => {
        expect(hook.result.current?.id).not.toBe(firstMoment?.id);
      });
    });
  });
});

interface Rendered {
  readonly result: {readonly current: GameMoment | undefined};
  readonly played: PlayedGame;
  readonly rerender: (props: {played: PlayedGame}) => void;
  /** Renders the hook against a new record, and remembers it as the one now shown. */
  readonly show: (played: PlayedGame) => void;
}

function renderOn(initial: PlayedGame): Rendered {
  const rendered = renderHook(({played}: {played: PlayedGame}) => useGameMoment(played), {
    initialProps: {played: initial},
  });

  const handle = {
    result: rendered.result,
    played: initial,
    rerender: (props: {played: PlayedGame}) => rendered.rerender(props),
    show: (played: PlayedGame) => {
      handle.played = played;
      rendered.rerender({played});
    },
  };

  return handle;
}

function opening(): PlayedGame {
  return playedGameFrom(newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual"));
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
