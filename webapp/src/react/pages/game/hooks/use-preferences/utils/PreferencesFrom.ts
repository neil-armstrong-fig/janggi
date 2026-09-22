import type {ArmyBoardStyles} from "@src/styles/board-halves/types/ArmyBoardStyles";
import type {ArmyPieceSets} from "@src/styles/piece-sets/types/ArmyPieceSets";
import {BIKJANG_HINTS} from "@src/react/pages/game/utils/BikjangHints";
import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {combinedBoardStyle} from "@src/styles/board-halves/CombinedBoardStyle";
import {combinedPieceSet} from "@src/styles/piece-sets/CombinedPieceSet";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import {EFFECTS} from "@src/react/pages/game/utils/EffectsOptions";
import {MOVABLE_HIGHLIGHTS} from "@src/react/pages/game/utils/MovableHighlights";
import type {Preferences} from "@src/react/pages/game/hooks/use-preferences/types/Preferences";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import type {WithName} from "@src/react/pages/game/types/WithName";
import {boardStylePrice} from "@src/redux/progress/unlocks/BoardStylePrice";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {pieceSetPrice} from "@src/redux/progress/unlocks/PieceSetPrice";

/**
 * The styles and options the store's preferences name, and the two volumes and the sheet's opacity as
 * they are.
 *
 * A style is worn only where the player may wear it — a built-in their XP has unlocked, or one of their
 * own — and `xp` and `customStyles` are what that is asked of.
 */
export function preferencesFrom(
  names: PreferencesSliceState,
  xp: number,
  customStyles: CustomStylesSliceState,
): Preferences {
  const defaults = defaultPreferences();
  const boardStyles = [...BUILT_IN_STYLES, ...customStyles.boards];
  const wornBoard = (name: string): BoardStyle =>
    wornOf(boardStyles, name, defaults.boardStyle, candidate => xp >= boardStylePrice(candidate));
  const armyBoardStyles: ArmyBoardStyles = {
    cho: wornBoard(names.boardStyle),
    han: wornBoard(names.hanBoardStyle ?? names.boardStyle),
  };
  const pieceSetStyles = [...BUILT_IN_PIECE_STYLES, ...customStyles.pieceSets];
  const wornPieces = (name: string): PieceSetStyle =>
    wornOf(pieceSetStyles, name, defaults.pieceSet, candidate => xp >= pieceSetPrice(candidate));
  const armyPieceSets: ArmyPieceSets = {
    cho: wornPieces(names.pieceSet),
    han: wornPieces(names.hanPieceSet ?? names.pieceSet),
  };

  return {
    boardStyle: combinedBoardStyle(armyBoardStyles),
    armyBoardStyles,
    pieceStyle: combinedPieceSet(armyPieceSets),
    armyPieceSets,
    movableHighlight: namedIn(MOVABLE_HIGHLIGHTS, names.movableHighlight),
    bikjangHint: namedIn(BIKJANG_HINTS, names.bikjangHint),
    effects: namedIn(EFFECTS, names.effects),
    soundEffectsVolume: names.soundEffectsVolume,
    musicVolume: names.musicVolume,
    sheetOpacity: names.sheetOpacity,
  };
}

/**
 * The style named, where it is there to wear, and otherwise the default. Unlike the other preferences a
 * style's name can honestly point at nothing — one of the player's own they have since deleted, or a
 * built-in that a save with less XP in it has locked again — and neither is a reason to stop drawing.
 */
function wornOf<Style extends WithName>(
  styles: readonly Style[],
  name: string,
  fallback: string,
  isUnlocked: (name: string) => boolean,
): Style {
  const chosen = styles.find(style => style.name === name && isUnlocked(name));

  return chosen ?? namedIn(styles, fallback);
}

/**
 * Throws rather than falling back to a default: every name reaching here is one `@janggi/shared`
 * publishes, so a name with nothing behind it is a built-in that was dropped from its list, and a board
 * quietly drawn in some other way would hide that.
 */
function namedIn<Option extends WithName>(options: readonly Option[], name: Option["name"]): Option {
  const option = options.find(candidate => candidate.name === name);
  if (!option) throw new Error(`Nothing is named "${name}"`);

  return option;
}
