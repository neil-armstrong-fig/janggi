import type {BeatenBySide, SaveProgress} from "@src/shared/share-keys/types/SaveProgress";
import type {NoCustomStyles} from "@src/shared/share-keys/types/NoCustomStyles";
import {LATEST_SAVE_VERSION} from "@janggi/shared/janggi/progress/SaveKeyJson";
import type {SaveKeyJson} from "@janggi/shared/janggi/progress/SaveKeyJson";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";

/**
 * A save key holding the progress given and none of the player's own styles — how a spec puts a player
 * wherever on the ladders it needs them, through the same box a player moving device uses. Winning the
 * games that would earn it is far deeper than a spec can tap.
 *
 * **Built against the app's own schema and codec**, from `@janggi/shared`, rather than written out as raw
 * JSON here. The format is a wire contract rather than a behaviour under test, so a second copy of it
 * would only be a second thing to drift: a field renamed in `SaveKeyJson` now fails to compile here too,
 * instead of every spec that loads a save quietly loading a player who has never played.
 *
 * Whatever is left out is at the bottom, so a spec names only the ladder it is about.
 */
export function saveKeyWith({xp, beaten}: SaveProgress): string {
  const written: SaveKeyJson<NoCustomStyles> = {
    v: LATEST_SAVE_VERSION,
    xp,
    beaten: {Casual: ladder(beaten?.Casual), Scored: ladder(beaten?.Scored)},
    customStyles: {boards: [], pieceSets: []},
  };

  return encodeKey("save", written);
}

function ladder(beaten: BeatenBySide | undefined): Required<BeatenBySide> {
  return {cho: [], han: [], ...beaten};
}
