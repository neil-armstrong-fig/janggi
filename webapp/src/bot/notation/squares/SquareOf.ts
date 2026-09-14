import {FILE_LETTERS} from "@src/bot/notation/squares/utils/FileLetters";
import type {Position} from "@src/game/board/types/Position";

/**
 * A point as the engine names it: a file letter and a rank counted **up from Cho's edge**, so our
 * rank 10 is its 1 and our rank 1 its 10. `docs/rules.md` §1 numbers ranks the other way, top down.
 */
export function squareOf({file, rank}: Position): string {
  return `${FILE_LETTERS[file - 1]}${RANK_COUNT_PLUS_ONE - rank}`;
}

const RANK_COUNT_PLUS_ONE = 11;
