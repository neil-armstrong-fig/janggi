import {sceneStart} from "@src/react/pages/game/tutorial/scene-start/SceneStart";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";

/**
 * A draw agreed (합의): the player offers it, and the script accepts it for Han. The ending says a scored game has no draw
 * to agree. The last scene: the closing card after it tells of time running out (`tutorial.closing` in `Messages`).
 */
export const AN_AGREEMENT: TutorialScene = {
  name: "an-agreement",
  start: sceneStart(
    [
      {piece: {side: "han", type: "general"}, position: {file: 4, rank: 1}},
      {piece: {side: "han", type: "horse"}, position: {file: 8, rank: 3}},
      {piece: {side: "han", type: "soldier"}, position: {file: 3, rank: 4}},
      {piece: {side: "cho", type: "general"}, position: {file: 6, rank: 9}},
      {piece: {side: "cho", type: "horse"}, position: {file: 2, rank: 8}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 7, rank: 7}},
    ],
    "cho",
  ),
  steps: [
    {
      actor: "player",
      turn: {kind: "draw"},
    },
  ],
  outcome: "agreement",
};
