import {sceneStart} from "@src/react/pages/game/tutorial/scene-start/SceneStart";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";

/**
 * A bikjang (빅장), called: Han steps aside the one piece between the generals, and the player calls it. A casual game, so
 * it is drawn; the ending says what a scored game makes of it.
 */
export const A_BIKJANG: TutorialScene = {
  name: "a-bikjang",
  start: sceneStart(
    [
      {piece: {side: "han", type: "general"}, position: {file: 5, rank: 1}},
      {piece: {side: "han", type: "guard"}, position: {file: 5, rank: 2}},
      {piece: {side: "han", type: "soldier"}, position: {file: 1, rank: 4}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
      {piece: {side: "cho", type: "guard"}, position: {file: 4, rank: 10}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 9, rank: 7}},
    ],
    "cho",
  ),
  steps: [
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 9, rank: 7}, to: {file: 9, rank: 6}}},
      lookAt: "han",
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 5, rank: 2}, to: {file: 4, rank: 2}}},
      lookAt: "han",
    },
    {
      actor: "player",
      turn: {kind: "bikjang"},
      lookAt: "han",
    },
  ],
  endingLookAt: "han",
  outcome: "bikjang",
};
