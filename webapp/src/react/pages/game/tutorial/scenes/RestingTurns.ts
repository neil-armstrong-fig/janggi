import {sceneStart} from "@src/react/pages/game/tutorial/scene-start/SceneStart";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";

/**
 * Two turns rested in a row (한수쉼), which end the game on points: the player rests, Han rests, and Cho, well ahead,
 * wins. The ending gives the values the points are counted in, and Han's 덤.
 */
export const RESTING_TURNS: TutorialScene = {
  name: "resting-turns",
  start: sceneStart(
    [
      {piece: {side: "han", type: "general"}, position: {file: 4, rank: 1}},
      {piece: {side: "han", type: "guard"}, position: {file: 5, rank: 2}},
      {piece: {side: "han", type: "soldier"}, position: {file: 3, rank: 4}},
      {piece: {side: "cho", type: "general"}, position: {file: 6, rank: 9}},
      {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}},
      {piece: {side: "cho", type: "horse"}, position: {file: 2, rank: 8}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 7, rank: 7}},
    ],
    "cho",
  ),
  steps: [
    {
      actor: "player",
      turn: {kind: "pass"},
    },
    {
      actor: "opponent",
      turn: {kind: "pass"},
    },
  ],
  outcome: "pointsWin",
};
