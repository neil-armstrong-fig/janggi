import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import {newGame} from "@janggi/engine/NewGame";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";

/**
 * The tutorial's first scene, a whole game from both armies on the common arrangement with the player as Cho (초), who
 * moves first, through to Cho's 외통 on its 18th move. On the way the player moves every kind of piece, takes with a
 * cannon over a screen, checks and is checked; Han's moves are the ones that let that happen, not its best. A player
 * step's words say what Han's last move did and what to do now, Han's own being up only while its answer is coming.
 */
export const THE_WHOLE_GAME: TutorialScene = {
  name: "the-whole-game",
  start: newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
  steps: [
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 3, rank: 7}, to: {file: 3, rank: 6}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 3, rank: 4}, to: {file: 3, rank: 5}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 3, rank: 6}, to: {file: 3, rank: 5}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 8, rank: 1}, to: {file: 7, rank: 3}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 2, rank: 10}, to: {file: 3, rank: 8}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 8, rank: 3}, to: {file: 5, rank: 3}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 2, rank: 8}, to: {file: 5, rank: 8}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 2, rank: 1}, to: {file: 3, rank: 3}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 1, rank: 10}, to: {file: 2, rank: 10}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 2, rank: 3}, to: {file: 4, rank: 3}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 2, rank: 10}, to: {file: 2, rank: 2}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 4, rank: 1}, to: {file: 4, rank: 2}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 7, rank: 7}, to: {file: 8, rank: 7}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 5, rank: 3}, to: {file: 5, rank: 7}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 3, rank: 10}, to: {file: 5, rank: 7}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 3, rank: 3}, to: {file: 4, rank: 5}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 5, rank: 7}, to: {file: 7, rank: 4}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 4, rank: 5}, to: {file: 5, rank: 3}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 5, rank: 8}, to: {file: 5, rank: 3}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 5, rank: 2}, to: {file: 5, rank: 3}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 8, rank: 8}, to: {file: 8, rank: 3}}},
      lookAt: "han",
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 5, rank: 3}, to: {file: 5, rank: 2}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 9, rank: 10}, to: {file: 9, rank: 8}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 1, rank: 4}, to: {file: 2, rank: 4}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 9, rank: 8}, to: {file: 6, rank: 8}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 1, rank: 1}, to: {file: 1, rank: 6}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 8, rank: 3}, to: {file: 8, rank: 8}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 1, rank: 6}, to: {file: 5, rank: 6}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 5, rank: 9}, to: {file: 4, rank: 9}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 5, rank: 6}, to: {file: 5, rank: 9}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 4, rank: 10}, to: {file: 5, rank: 9}}},
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 9, rank: 4}, to: {file: 8, rank: 4}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 8, rank: 8}, to: {file: 5, rank: 8}}},
      lookAt: "han",
    },
    {
      actor: "opponent",
      turn: {kind: "move", move: {from: {file: 5, rank: 2}, to: {file: 4, rank: 1}}},
    },
    {
      actor: "player",
      turn: {kind: "move", move: {from: {file: 2, rank: 2}, to: {file: 4, rank: 2}}},
      lookAt: "han",
    },
  ],
  outcome: "checkmate",
};
