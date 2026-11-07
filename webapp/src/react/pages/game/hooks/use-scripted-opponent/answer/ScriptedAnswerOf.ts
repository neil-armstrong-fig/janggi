import type {GameState} from "@janggi/engine/types/GameState";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";
import type {UnknownAction} from "@reduxjs/toolkit";
import {canPass} from "@janggi/engine/passing/CanPass";
import {drawAccepted, moved, passed} from "@src/redux/slices/game/GameSlice";
import {isPlayable} from "@src/react/pages/game/hooks/use-scripted-opponent/playable/IsPlayable";

/**
 * What the script does for Han at `step`, from `game`: Han's own move or rest, or the acceptance of the draw the player's
 * step asked them to offer, once `offerPending` says they have. Nothing where the step is the player's to take, or where
 * the rules would refuse it — a tutorial knocked off its script sticks rather than crashing the page.
 */
export function scriptedAnswerOf(
  step: TutorialStep | undefined,
  game: GameState,
  offerPending: boolean,
): UnknownAction | undefined {
  if (step === undefined) return undefined;

  if (step.actor === "player") {
    if (step.turn.kind === "draw" && offerPending) return drawAccepted();

    return undefined;
  }

  if (step.turn.kind === "move") {
    if (isPlayable(game, step.turn.move)) return moved(step.turn.move);

    return undefined;
  }

  if (step.turn.kind === "pass" && canPass(game)) return passed();

  return undefined;
}
