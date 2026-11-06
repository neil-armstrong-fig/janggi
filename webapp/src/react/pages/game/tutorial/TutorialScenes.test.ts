import {expect, it} from "vitest";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";
import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import {TUTORIAL_SCENE_NAMES} from "@janggi/shared/janggi/tutorial/TutorialSceneName";
import {messagesOf} from "@src/language/MessagesOf";
import {THE_WHOLE_GAME} from "@src/react/pages/game/tutorial/scenes/TheWholeGame";
import {A_REPETITION} from "@src/react/pages/game/tutorial/scenes/ARepetition";
import {repetitionHoldsBackAMove} from "@janggi/engine/repetition/RepetitionHoldsBackAMove";
import {isRepetition} from "@janggi/engine/repetition/IsRepetition";
import {positionAfter} from "@janggi/engine/utils/PositionAfter";
import {TUTORIAL_SCENES} from "@src/react/pages/game/tutorial/TutorialScenes";
import {agreeADrawIn} from "@src/record/drawing/AgreeADrawIn";
import {callBikjangIn} from "@src/record/bikjang/CallBikjangIn";
import {canAgreeADraw} from "@janggi/engine/drawing/CanAgreeADraw";
import {canCallBikjang} from "@janggi/engine/bikjang/CanCallBikjang";
import {canPass} from "@janggi/engine/passing/CanPass";
import {isInCheck} from "@janggi/engine/check/IsInCheck";
import {legalMovesFor} from "@janggi/engine/LegalMovesFor";
import {outcomeOf} from "@janggi/engine/OutcomeOf";
import {playMove} from "@src/record/moving/PlayMove";
import {playedGameFrom} from "@src/record/PlayedGameFrom";
import {restTurn} from "@src/record/resting/RestTurn";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";
import type {GameState} from "@janggi/engine/types/GameState";
import type {Move} from "@janggi/engine/types/Move";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PlayedGame} from "@src/record/types/PlayedGame";
import type {Position} from "@janggi/engine/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {TutorialActor} from "@src/react/pages/game/tutorial/types/TutorialActor";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";
import type {TutorialTurn} from "@src/react/pages/game/tutorial/types/TutorialTurn";

const SIDE_OF: Record<TutorialActor, Side> = {player: "cho", opponent: "han"};
const SCENES = TUTORIAL_SCENES.map(scene => [scene.name, scene] as const);

/** A step of a scene, with the position it is taken from and the one it leaves. */
interface ReplayedStep {
  readonly step: TutorialStep;
  readonly before: GameState;
  readonly after: GameState;
}

/** A move of the player's, with the position it is made from. */
interface PlayersMove {
  readonly move: Move;
  readonly before: GameState;
}

it.each(SCENES)("%s: every turn is one the rules allow, by the army whose turn it is", (_name, scene) => {
  replayed(scene).forEach(({step, before}, index) => {
    expect(before.sideToMove, `step ${index + 1}`).toBe(SIDE_OF[step.actor]);
    expect(isAllowed(before, step.turn), `step ${index + 1}`).toBe(true);
  });
});

it.each(SCENES)("%s: opens undecided and out of check", (_name, {start}) => {
  expect(outcomeOf(start)).toEqual({kind: "undecided"});
  expect(isInCheck(start, start.sideToMove)).toBe(false);
});

it.each(SCENES)("%s: is not over before its last step", (_name, scene) => {
  replayed(scene).forEach(({before}, index) => {
    expect(outcomeOf(before), `before step ${index + 1}`).toEqual({kind: "undecided"});
  });
});

it.each(SCENES)("%s: ends the way it says it does, on its last step", (_name, scene) => {
  const last = replayed(scene).at(-1);

  expect(outcomeOf(last?.after ?? scene.start).kind).toBe(scene.outcome);
});

it("ends the whole game in the player's 외통, on the player's own move", () => {
  const last = replayed(THE_WHOLE_GAME).at(-1);

  expect(last?.step.actor).toBe("player");
  expect(outcomeOf(last?.after ?? THE_WHOLE_GAME.start)).toEqual({kind: "checkmate", winner: "cho"});
});

it("holds back the repeat on the repetition scene's last step, the move it asks for being something new", () => {
  const last = replayed(A_REPETITION).at(-1);

  expect(repetitionHoldsBackAMove(last?.before ?? A_REPETITION.start)).toBe(true);
});

it.each(SCENES)("%s: marks as held back only a move the repetition rule refuses at that step", (_name, scene) => {
  replayed(scene).forEach(({step, before}, index) => {
    if (step.heldBack === undefined) return;

    expect(legalMovesFor(before).map(keyOf), `step ${index + 1}`).not.toContain(keyOf(step.heldBack));
    expect(isRepetition(positionAfter(before, step.heldBack)), `step ${index + 1}`).toBe(true);
  });
});

it("marks the held-back move on the repetition scene's last step", () => {
  expect(A_REPETITION.steps.at(-1)?.heldBack).toBeDefined();
});

it("has the player move every kind of piece in the whole game", () => {
  const moved = new Set(playersMoves().map(({move, before}) => pieceAt(before, move.from)?.type));

  expect([...moved].sort()).toEqual([...PIECE_TYPES].sort());
});

it("has the player take with a cannon, over a piece between, in the whole game", () => {
  const cannonCaptures = playersMoves().filter(({move, before}) => {
    return pieceAt(before, move.from)?.type === "cannon" && pieceAt(before, move.to) !== undefined;
  });

  expect(cannonCaptures.length).toBeGreaterThan(0);
});

it("plays every scene there are words for, in their order", () => {
  expect(TUTORIAL_SCENES.map(scene => scene.name)).toEqual(TUTORIAL_SCENE_NAMES);
});

it.each(LANGUAGE_NAMES)("%s: has words for every step of every scene, so none is told another's", language => {
  const {scenes} = messagesOf(language).tutorial;

  for (const scene of TUTORIAL_SCENES) {
    expect(scenes[scene.name].steps, scene.name).toHaveLength(scene.steps.length);
  }
});

it.each(LANGUAGE_NAMES)("%s: says something at every step, every ending and the close", language => {
  const {scenes, closing} = messagesOf(language).tutorial;
  const said = Object.values(scenes).flatMap(scene => [...scene.steps, scene.ending]);

  expect([...said, closing.narration].every(words => words.title !== "" && words.body !== "")).toBe(true);
});

/** A scene played through from its start, a step at a time. */
function replayed(scene: TutorialScene): ReplayedStep[] {
  let played = playedGameFrom(scene.start);

  return scene.steps.map(step => {
    const before = played.present;
    played = playedAfter(played, step.turn);

    return {step, before, after: played.present};
  });
}

/** The record once `turn` is taken, the way the game's own actions take it. */
function playedAfter(played: PlayedGame, turn: TutorialTurn): PlayedGame {
  if (turn.kind === "move") return playMove(played, turn.move);

  if (turn.kind === "pass") return restTurn(played);

  if (turn.kind === "bikjang") return callBikjangIn(played);

  return agreeADrawIn(played);
}

function isAllowed(state: GameState, turn: TutorialTurn): boolean {
  if (turn.kind === "move") return legalMovesFor(state).map(keyOf).includes(keyOf(turn.move));

  if (turn.kind === "pass") return canPass(state);

  if (turn.kind === "bikjang") return canCallBikjang(state);

  return canAgreeADraw(state);
}

/** The whole game's moves by the player, with the position each is made from. */
function playersMoves(): PlayersMove[] {
  return replayed(THE_WHOLE_GAME).flatMap(({step, before}) => {
    if (step.actor !== "player" || step.turn.kind !== "move") return [];

    return [{move: step.turn.move, before}];
  });
}

function pieceAt(state: GameState, position: Position): Piece | undefined {
  return state.pieces.find(placed => toPositionKey(placed.position) === toPositionKey(position))?.piece;
}

function keyOf({from, to}: Move): string {
  return `${toPositionKey(from)}-${toPositionKey(to)}`;
}
