import {FILES} from "@src/game/board/BoardDimensions";
import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {File} from "@src/game/board/types/Position";
import type {Setup} from "@src/game/setups/types/Setup";

/**
 * Whether the two chosen arrangements come to 맞상 or 엇상, or to neither — the classification that
 * actually matters at the board, `docs/opening-setups.md` §5 and §7.
 *
 * Defined only where **both** players chose a 귀마 arrangement, one elephant out and one in. §7's
 * table is titled for exactly those four pairings and classifies nothing else: an arrangement whose
 * elephants mirror about the middle file develops on neither wing in particular, so there is nothing
 * to face or not face. That is what `undefined` says.
 *
 * **It reports; it bars nothing, in either format.** §5.4 has 장하영 프로 saying twice that 맞상 is
 * barred from official play — but that clause was not in the archived KJA 대국규칙 or 대국규정 read
 * in full, so it is a well-sourced claim about tournament practice rather than a rule with a text.
 * The engine takes the posture it takes on repetition in `IsRepetition.ts`: answer the question, and
 * leave acting on it to whoever has a referee.
 *
 * **Read off the elephant files, not off `SetupName`.** Which physical shape a *name* denotes is the
 * one thing `docs/opening-setups.md` rates Low confidence — §6's unresolved "whose left is 왼상?" —
 * while §7's table says of itself that it is convention-independent and the one to code against.
 * Files are also what `startingPieces` actually places, so the classification and the board cannot
 * come apart.
 */
export function elephantPairingOf(hanSetup: Setup, choSetup: Setup): ElephantPairing | undefined {
  const han = elephantFilesOf(hanSetup);
  const cho = elephantFilesOf(choSetup);

  if (isMirrored(han) || isMirrored(cho)) return undefined;

  return sameFiles(han, cho) ? "eotsang" : "matsang";
}

/** Which files this arrangement stands its elephants on, read straight off the back rank. */
function elephantFilesOf(setup: Setup): readonly File[] {
  return FILES.filter((_, index) => setup.backRank[index] === "elephant");
}

/**
 * Whether the arrangement is its own left-right mirror — the four symmetric setups are, and the two
 * 귀마 ones are not, which is the whole of what "귀마" means for this purpose.
 */
function isMirrored(files: readonly File[]): boolean {
  return sameFiles(
    files,
    files.map(file => MIRRORED_ABOUT_THE_MIDDLE - file),
  );
}

function sameFiles(one: readonly File[], other: readonly number[]): boolean {
  return [...one].sort().join() === [...other].sort().join();
}

/** File 1 mirrors to file 9 across the middle of a nine-file board, so the pair sums to ten. */
const MIRRORED_ABOUT_THE_MIDDLE = FILES.length + 1;
