import {sceneStart} from "@src/react/pages/game/tutorial/scene-start/SceneStart";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";

/**
 * A repetition held back: with 33 points of pieces a side, the two chariots go up and back until the player's move back
 * would make the position stand a third time, which the board does not offer, so they play something new and the game
 * goes on. The ending says what changes under 30 points a side: the third standing is allowed, and ends the game.
 */
export const A_REPETITION: TutorialScene = {
  name: "a-repetition",
  start: sceneStart(
    [
      {piece: {side: "han", type: "general"}, position: {file: 4, rank: 1}},
      {piece: {side: "han", type: "chariot"}, position: {file: 9, rank: 1}},
      {piece: {side: "han", type: "chariot"}, position: {file: 7, rank: 1}},
      {piece: {side: "han", type: "cannon"}, position: {file: 5, rank: 3}},
      {piece: {side: "cho", type: "general"}, position: {file: 6, rank: 9}},
      {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}},
      {piece: {side: "cho", type: "chariot"}, position: {file: 3, rank: 10}},
      {piece: {side: "cho", type: "cannon"}, position: {file: 5, rank: 8}},
    ],
    "han",
  ),
  steps: [
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 9, rank: 1}, to: {file: 9, rank: 2}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 1, rank: 10}, to: {file: 1, rank: 9}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 9, rank: 2}, to: {file: 9, rank: 1}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 1, rank: 9}, to: {file: 1, rank: 10}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 9, rank: 1}, to: {file: 9, rank: 2}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 1, rank: 10}, to: {file: 1, rank: 9}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 9, rank: 2}, to: {file: 9, rank: 1}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 1, rank: 9}, to: {file: 1, rank: 5}}},
      lookAt: "han",
      heldBack: {from: {file: 1, rank: 9}, to: {file: 1, rank: 10}},
    },
  ],
  outcome: "undecided",
};
