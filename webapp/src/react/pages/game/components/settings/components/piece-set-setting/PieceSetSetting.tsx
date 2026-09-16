import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {lockBehindXp} from "@src/react/pages/game/components/settings/locks/LockBehindXp";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {pieceSetChosen} from "@src/redux/preferences/PreferencesSlice";
import {pieceSetPrice} from "@src/redux/progress/unlocks/PieceSetPrice";

/**
 * The pieces the game is drawn with. A preference rather than part of the game, so a choice is worn at
 * once and never deals another position.
 *
 * Built-ins that cost more XP than the player has earned stay in the list with what opens them. The
 * player's own piece sets follow the built-ins and are never locked.
 */
export function PieceSetSetting(): React.JSX.Element {
  const xp = useAppSelector(state => state.progress.xp);
  const pieceSets = useAppSelector(state => state.customStyles.pieceSets);
  const {pieceStyle} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <OptionPicker
      id="piece-style"
      label="Pieces"
      options={[...BUILT_IN_PIECE_STYLES, ...pieceSets]}
      selected={pieceStyle}
      lockedReason={pieceSet => lockBehindXp(pieceSetPrice(pieceSet.name), xp)}
      onSelect={pieceSet => dispatch(pieceSetChosen(pieceSet.name))}
    />
  );
}
