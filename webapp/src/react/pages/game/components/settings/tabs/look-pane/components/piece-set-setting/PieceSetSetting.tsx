import {ArmySplitToggle} from "@src/react/pages/game/components/settings/components/army-split-toggle/ArmySplitToggle";
import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {armyPieceSetChosen, pieceSetChosen, pieceSetSplit} from "@src/redux/preferences/PreferencesSlice";
import {lockBehindXp} from "@src/react/pages/game/components/settings/tabs/look-pane/locks/LockBehindXp";
import {pieceSetPrice} from "@src/redux/progress/unlocks/PieceSetPrice";
import {sideName} from "@src/react/pages/game/utils/SideNames";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * The pieces the game is drawn with. A preference rather than part of the game, so a choice is worn at
 * once and never deals another position.
 *
 * One picker for both armies — choosing a set dresses them both. Underneath, a switch to choose Han's
 * and Cho's apart, for the player who wants Hanja for one and Hangul for the other; it is off unless
 * turned on, and turned off puts both back in Cho's.
 *
 * Built-ins that cost more XP than the player has earned stay in the list with what opens them. The
 * player's own piece sets follow the built-ins and are never locked.
 */
export function PieceSetSetting(): React.JSX.Element {
  const xp = useAppSelector(state => state.progress.xp);
  const pieceSets = useAppSelector(state => state.customStyles.pieceSets);
  const split = useAppSelector(state => state.preferences.hanPieceSet !== undefined);
  const {armyPieceSets} = usePreferences();
  const dispatch = useAppDispatch();

  const optionsPieceSetStyles = [...BUILT_IN_PIECE_STYLES, ...pieceSets];
  const lockedReason = (pieceSetStyle: PieceSetStyle): string | undefined =>
    lockBehindXp(pieceSetPrice(pieceSetStyle.name), xp);

  return (
    <div className="flex flex-col gap-2">
      {!split && (
        <OptionPicker
          id="piece-style"
          label="Pieces"
          options={optionsPieceSetStyles}
          selected={armyPieceSets.cho}
          lockedReason={lockedReason}
          onSelect={pieceSetStyle => dispatch(pieceSetChosen(pieceSetStyle.name))}
        />
      )}

      {split &&
        ARMIES.map(side => (
          <OptionPicker
            key={side}
            id={`${side}-piece-style`}
            label={`${sideName(side)}'s pieces`}
            options={optionsPieceSetStyles}
            selected={armyPieceSets[side]}
            lockedReason={lockedReason}
            onSelect={pieceSetStyle => dispatch(armyPieceSetChosen({side, name: pieceSetStyle.name}))}
          />
        ))}

      <ArmySplitToggle
        id="piece-style"
        split={split}
        label="Different pieces for each army"
        onToggle={() => dispatch(split ? pieceSetChosen(armyPieceSets.cho.name) : pieceSetSplit())}
      />
    </div>
  );
}

const ARMIES: readonly Side[] = ["han", "cho"];
