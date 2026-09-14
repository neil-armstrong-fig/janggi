import type {BoardLine} from "@src/react/pages/game/components/board/types/BoardLine";
import type {Threat} from "@src/react/pages/game/components/board/types/Threat";

/** A line from each piece giving check to the general it attacks, drawn the way the attack travels. */
export function checkLinesOf(threat: Threat): readonly BoardLine[] {
  return threat.attackers.map(from => ({from, to: threat.general}));
}
