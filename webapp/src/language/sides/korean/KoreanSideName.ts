import {KOREAN_SIDES} from "@src/language/sides/korean/KoreanSides";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * What an army is called in Korean, for a sentence that names one. No particle follows it in this game's sentences (초
 * 승리, not 초가 이겼습니다), since the particle changes with the sound before it.
 */
export function koreanSideName(side: Side): string {
  return KOREAN_SIDES[side];
}
