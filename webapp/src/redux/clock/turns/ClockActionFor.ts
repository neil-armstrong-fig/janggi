import type {ClockChange} from "@src/redux/clock/turns/types/ClockChange";
import type {PlayedGame} from "@src/record/types/PlayedGame";
import type {UnknownAction} from "@reduxjs/toolkit";
import {clockDealt, clockStarted, turnCharged} from "@src/redux/clock/ClockSlice";
import {outcomeOf} from "@janggi/engine/OutcomeOf";

/**
 * What one change to the record means for the clock, if anything.
 *
 * - **A deal gives both armies their time afresh**, with no clock running, however the game came to be dealt.
 * - **The first turn starts the clock**, on the army that replies: nobody's time runs while the first move is thought over.
 * - **A turn after that is charged** to the army that took it, a pass (한수쉼) like any other, and the clock runs on for the
 *   other, unless that turn ended the game.
 * - **Nothing else means anything to it**: a turn cannot be taken back or played again on a clock (`Controls`).
 */
export function clockActionFor({change, played, inUse, running}: ClockChange, now: number): UnknownAction | undefined {
  if (change.direction === "dealt") return clockDealt();

  if (!inUse || change.direction !== "advanced") return undefined;

  return afterTurn(played, running, now);
}

function afterTurn(played: PlayedGame, running: boolean, now: number): UnknownAction | undefined {
  const turnTaken = played.past.at(-1);
  if (!turnTaken) return undefined;

  if (running) return turnCharged({side: turnTaken.sideToMove, at: now, runsOn: !isDecided(played)});

  if (played.past.length === 1 && !isDecided(played)) return clockStarted(now);

  return undefined;
}

function isDecided({present}: PlayedGame): boolean {
  return outcomeOf(present).kind !== "undecided";
}
