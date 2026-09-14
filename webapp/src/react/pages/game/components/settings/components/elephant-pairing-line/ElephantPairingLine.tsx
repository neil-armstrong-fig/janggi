import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {Setup} from "@src/game/setups/types/Setup";
import {elephantPairingOf} from "@src/game/setups/ElephantPairingOf";

/**
 * What the two chosen arrangements have come to, where the game has a name for it — 맞상 or 엇상.
 *
 * It sits under the two setup pickers because it belongs to neither: it falls out of both choices at
 * once, which is the whole reason the two armies are picked separately. Reading it is how a player
 * learns that the pairing is a thing at all, and the Korean is shown beside the plain English so the
 * two are learnable together, as the setup names are.
 *
 * **It reports and bars nothing.** 맞상 is said to be barred from official play, but that clause is
 * not in the KJA's own rulebook — `docs/opening-setups.md` §5.4 — so the app names the shape and
 * leaves the decision to the players. Nothing here is disabled by it.
 *
 * Renders nothing at all unless both armies have chosen a 귀마 arrangement, which is the only
 * pairing §7's table classifies. An absent line rather than a line saying "neither": there is no
 * such thing to tell a player about.
 */
interface Props {
  readonly hanSetup: Setup | undefined;
  readonly choSetup: Setup | undefined;
}

export function ElephantPairingLine({hanSetup, choSetup}: Props): React.JSX.Element | null {
  const pairing = hanSetup && choSetup ? elephantPairingOf(hanSetup, choSetup) : undefined;

  if (!pairing) return null;

  return (
    <p data-testid="elephant-pairing" data-pairing={pairing} className="text-xs text-wood/70">
      {DESCRIPTIONS[pairing]}
    </p>
  );
}

/** The Korean names the game itself uses, each with what it means on the board. */
const DESCRIPTIONS: Record<ElephantPairing, string> = {
  matsang: "맞상 — the outer elephants face each other, and must trade",
  eotsang: "엇상 — both armies developed on the same wing",
};
