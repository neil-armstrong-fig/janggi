import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Whether an army may lay its back rank out now — the whole of `docs/rules.md` §6.6, and the second
 * rule after bikjang where the two match formats part company.
 *
 * > 후수자가 먼저 기물을 차리고 선수자가 나중에 차린다. 이때 후수자는 馬와 象의 배치를 바꿔 다시
 * > 차릴 수 없다. — 대한장기협회, 대국규정 「판차림의 순서」
 *
 * **Casual** — anybody, any order, as often as they like. The clause above is a regulation of
 * official play, so a friendly game is not held to it, and this is where that is decided.
 *
 * **Scored** — Han lays out first and lives with it; Cho answers what it can see, and may keep
 * changing its answer until the first move. Cho's right to choose last, to change that choice, and
 * to move first are the three privileges Han's 1.5 덤 pays for — `docs/opening-setups.md` §4.
 *
 * This stands to `place` as `canPass` stands to `pass`: the question a screen asks in order to offer
 * the choice, where `place` is the choice being made.
 */
export function canPlace(phase: SetupPhase, side: Side): boolean {
  if (phase.format === "Casual") return true;

  if (side === "han") return phase.hanSetup === undefined;

  return phase.hanSetup !== undefined;
}
