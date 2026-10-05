import type {GameRoomOperation} from "@src/observability/types/GameRoomOperation";
import {errorNameOf} from "@src/observability/ErrorNameOf";
import {logApiEvent} from "@src/observability/LogApiEvent";

type GameRoomWork<Result> = () => Promise<Result>;

/** Logs an unexpected Durable Object boundary failure and preserves what was thrown. */
export async function observeGameRoomOperation<Result>(
  operation: GameRoomOperation,
  work: GameRoomWork<Result>,
): Promise<Result> {
  try {
    return await work();
  } catch (error) {
    logApiEvent({
      event: "game_room",
      outcome: "unexpected_failure",
      operation,
      errorName: errorNameOf(error),
    });

    throw error;
  }
}
