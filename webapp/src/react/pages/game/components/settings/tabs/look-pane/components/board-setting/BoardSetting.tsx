import {ArmySplitToggle} from "@src/react/pages/game/components/settings/components/army-split-toggle/ArmySplitToggle";
import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {armyBoardStyleChosen, boardStyleChosen, boardStyleSplit} from "@src/redux/preferences/PreferencesSlice";
import {boardStylePrice} from "@src/redux/progress/unlocks/BoardStylePrice";
import {lockBehindXp} from "@src/react/pages/game/components/settings/tabs/look-pane/locks/LockBehindXp";
import {sideName} from "@src/react/pages/game/utils/SideNames";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * The board the game is drawn on. A preference rather than part of the game, so a choice is worn at once
 * and never deals another position.
 *
 * One picker for both armies — choosing a board dresses them both. Underneath, a switch to choose Han's
 * and Cho's apart, for the player who wants a board of their own for each half; it is off unless turned
 * on, and turned off puts both back on Cho's. Han holds ranks 1-5, Cho 6-10.
 *
 * Built-ins that cost more XP than the player has earned stay in the list with what opens them. The
 * player's own boards follow the built-ins and are never locked.
 */
export function BoardSetting(): React.JSX.Element {
  const xp = useAppSelector(state => state.progress.xp);
  const boards = useAppSelector(state => state.customStyles.boards);
  const split = useAppSelector(state => state.preferences.hanBoardStyle !== undefined);
  const {armyBoardStyles} = usePreferences();
  const dispatch = useAppDispatch();

  const optionsBoardStyles = [...BUILT_IN_STYLES, ...boards];
  const lockedReason = (boardStyle: BoardStyle): string | undefined =>
    lockBehindXp(boardStylePrice(boardStyle.name), xp);

  return (
    <div className="flex flex-col gap-2">
      {!split && (
        <OptionPicker
          id="board-style"
          label="Board"
          options={optionsBoardStyles}
          selected={armyBoardStyles.cho}
          lockedReason={lockedReason}
          onSelect={boardStyle => dispatch(boardStyleChosen(boardStyle.name))}
        />
      )}

      {split &&
        ARMIES.map(side => (
          <OptionPicker
            key={side}
            id={`${side}-board-style`}
            label={`${sideName(side)}'s board`}
            options={optionsBoardStyles}
            selected={armyBoardStyles[side]}
            lockedReason={lockedReason}
            onSelect={boardStyle => dispatch(armyBoardStyleChosen({side, name: boardStyle.name}))}
          />
        ))}

      <ArmySplitToggle
        id="board-style"
        split={split}
        label="Different board for each army"
        onToggle={() => dispatch(split ? boardStyleChosen(armyBoardStyles.cho.name) : boardStyleSplit())}
      />
    </div>
  );
}

const ARMIES: readonly Side[] = ["han", "cho"];
