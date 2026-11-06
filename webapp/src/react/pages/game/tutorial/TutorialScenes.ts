import {AN_AGREEMENT} from "@src/react/pages/game/tutorial/scenes/AnAgreement";
import {A_BIKJANG} from "@src/react/pages/game/tutorial/scenes/ABikjang";
import {A_REPETITION} from "@src/react/pages/game/tutorial/scenes/ARepetition";
import {RESTING_TURNS} from "@src/react/pages/game/tutorial/scenes/RestingTurns";
import {THE_WHOLE_GAME} from "@src/react/pages/game/tutorial/scenes/TheWholeGame";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";

/**
 * The tutorial, scene by scene: a whole game through to 외통 first, then a short posed scene for each other way a game
 * ends — a called bikjang, a repetition (shown held back above 30 points, its ending telling what it does below), two
 * turns rested, a draw agreed. Time running out is told of after them, on the closing card (`tutorial.closing` in `Messages`), the
 * tutorial having no clock. `TutorialScenes.test.ts` plays every scene through the engine, so a turn it would refuse, or a
 * scene that ends early, late or the wrong way, fails there first.
 */
export const TUTORIAL_SCENES: readonly TutorialScene[] = [
  THE_WHOLE_GAME,
  A_BIKJANG,
  A_REPETITION,
  RESTING_TURNS,
  AN_AGREEMENT,
];
