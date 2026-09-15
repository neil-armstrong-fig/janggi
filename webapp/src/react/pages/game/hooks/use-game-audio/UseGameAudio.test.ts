// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {CueName} from "@src/audio/types/CueName";
import {FULL_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {Move} from "@src/game/types/Move";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {changeBetween} from "@src/game/record/ChangeBetween";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {renderHook} from "@testing-library/react";
import {useGameAudio} from "@src/react/pages/game/hooks/use-game-audio/UseGameAudio";

/**
 * Which sounds a change makes and how the music feels are decided by `cuesFor` and `moodOf` and tested
 * beside them.
 * What is tested here is only what the page does with them — so the director is replaced by one that
 * remembers what it was asked, and no audio device is ever opened.
 *
 * Nested, each level doing one thing to the game its parent left behind.
 */

const director = vi.hoisted(() => ({
  unlock: vi.fn(),
  play: vi.fn(),
  sound: vi.fn(),
  setMood: vi.fn(),
  setChannels: vi.fn(),
  setOnScreen: vi.fn(),
  dispose: vi.fn(),
}));

vi.mock("@src/audio/CreateAudioDirector", () => ({createAudioDirector: () => director}));

const SOLDIER_STEP: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};

let hook: Rendered;

describe("a game being listened to", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setVisibility("visible");
    hook = renderOn(opening());
  });

  it("tells the sound the page is on screen", () => {
    expect(director.setOnScreen).toHaveBeenLastCalledWith(true);
  });

  it("has nothing to play before the game has changed", () => {
    expect(director.play).not.toHaveBeenCalled();
  });

  it("asks for the sound effects and the music at the volumes chosen", () => {
    expect(director.setChannels).toHaveBeenLastCalledWith({effects: 1, music: 1});
  });

  it("tells the music how the opening feels, with the game not yet under way", () => {
    expect(director.setMood).toHaveBeenLastCalledWith({tension: 0, inCheck: false, ending: "none", underWay: false});
  });

  it("lets sound start on the first tap anywhere on the page", () => {
    window.dispatchEvent(new Event("pointerdown"));

    expect(director.unlock).toHaveBeenCalled();
  });

  it("plays a sound the page asks for straight away, as often as it is asked", () => {
    hook.sound("pieceLifted");
    hook.sound("pieceLifted");

    expect(director.sound).toHaveBeenCalledTimes(2);
    expect(director.sound).toHaveBeenCalledWith({name: "pieceLifted", weight: 1});
  });

  it("follows a channel being turned down, as a share of full volume", () => {
    hook.rerender({...hook.props, musicVolume: 40});

    expect(director.setChannels).toHaveBeenLastCalledWith({effects: 1, music: 0.4});
  });

  describe("when a move is played", () => {
    beforeEach(() => {
      const after = playMove(hook.props.played, SOLDIER_STEP);
      const moment: GameMoment = {id: 1, ...changeBetween(hook.props.played, after)};

      hook.rerender({...hook.props, played: after, moment});
    });

    it("plays the move's sounds, under the id of the moment they came from", () => {
      expect(director.play).toHaveBeenCalledWith([{name: "piecePlaced", weight: 0.5}], 1);
    });

    it("does not ask for them again when rendered again with nothing changed", () => {
      hook.rerender({...hook.props});

      expect(director.play).toHaveBeenCalledTimes(1);
    });

    it("tells the music the game is under way", () => {
      expect(director.setMood).toHaveBeenLastCalledWith(expect.objectContaining({underWay: true}));
    });
  });

  describe("when the page is put away", () => {
    beforeEach(() => {
      turnPage("hidden");
    });

    it("holds every sound", () => {
      expect(director.setOnScreen).toHaveBeenLastCalledWith(false);
    });

    describe("and brought back", () => {
      beforeEach(() => {
        turnPage("visible");
      });

      it("lets the sound carry on", () => {
        expect(director.setOnScreen).toHaveBeenLastCalledWith(true);
      });
    });
  });

  describe("when the page goes", () => {
    beforeEach(() => {
      hook.unmount();
    });

    it("no longer follows the page being put away", () => {
      director.setOnScreen.mockClear();
      turnPage("hidden");

      expect(director.setOnScreen).not.toHaveBeenCalled();
    });

    it("lets the audio device go", () => {
      expect(director.dispose).toHaveBeenCalled();
    });

    it("no longer wakes sound on a tap", () => {
      director.unlock.mockClear();
      window.dispatchEvent(new Event("pointerdown"));

      expect(director.unlock).not.toHaveBeenCalled();
    });
  });
});

interface Props {
  readonly played: PlayedGame;
  readonly moment: GameMoment | undefined;
  readonly soundEffectsVolume: Volume;
  readonly musicVolume: Volume;
}

interface Rendered {
  props: Props;
  readonly rerender: (props: Props) => void;
  readonly unmount: () => void;
  /** Plays a sound through whatever the hook last handed back. */
  readonly sound: (name: CueName) => void;
}

function renderOn(played: PlayedGame): Rendered {
  const initialProps: Props = {
    played,
    moment: undefined,
    soundEffectsVolume: FULL_VOLUME,
    musicVolume: FULL_VOLUME,
  };
  const rendered = renderHook(
    ({played: game, moment, soundEffectsVolume, musicVolume}: Props) =>
      useGameAudio(game, moment, soundEffectsVolume, musicVolume),
    {initialProps},
  );

  const handle: Rendered = {
    props: initialProps,
    rerender: (props: Props) => {
      handle.props = props;
      rendered.rerender(props);
    },
    unmount: () => rendered.unmount(),
    sound: (name: CueName) => rendered.result.current(name),
  };

  return handle;
}

/** Puts the page away or brings it back, as a phone does when the app is switched from or to. */
function turnPage(state: DocumentVisibilityState): void {
  setVisibility(state);
  document.dispatchEvent(new Event("visibilitychange"));
}

function setVisibility(state: DocumentVisibilityState): void {
  Object.defineProperty(document, "visibilityState", {configurable: true, value: state});
}

function opening(): PlayedGame {
  return playedGameFrom(newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual"));
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
