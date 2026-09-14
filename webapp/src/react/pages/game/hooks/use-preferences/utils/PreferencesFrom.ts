import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import {EFFECTS} from "@src/react/pages/game/utils/EffectsOptions";
import {MOVABLE_HIGHLIGHTS} from "@src/react/pages/game/utils/MovableHighlights";
import type {Preferences} from "@src/react/pages/game/hooks/use-preferences/types/Preferences";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import type {WithName} from "@src/react/pages/game/types/WithName";

/** The styles and options the store's preferences name, and the two volumes as they are. */
export function preferencesFrom(names: PreferencesSliceState): Preferences {
  return {
    boardStyle: namedIn(BUILT_IN_STYLES, names.boardStyle),
    pieceStyle: namedIn(BUILT_IN_PIECE_STYLES, names.pieceSet),
    movableHighlight: namedIn(MOVABLE_HIGHLIGHTS, names.movableHighlight),
    effects: namedIn(EFFECTS, names.effects),
    soundEffectsVolume: names.soundEffectsVolume,
    musicVolume: names.musicVolume,
  };
}

/**
 * Throws rather than falling back to a default: every name the store can hold is one `@janggi/shared`
 * publishes, so a name with nothing behind it is a built-in that was dropped from its list, and a board
 * quietly drawn in some other style would hide that.
 */
function namedIn<Option extends WithName>(options: readonly Option[], name: Option["name"]): Option {
  const option = options.find(candidate => candidate.name === name);
  if (!option) throw new Error(`Nothing is named "${name}"`);

  return option;
}
