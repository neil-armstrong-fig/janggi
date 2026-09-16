import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {lockBehindXp} from "@src/react/pages/game/components/settings/locks/LockBehindXp";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {boardStyleChosen} from "@src/redux/preferences/PreferencesSlice";
import {boardStylePrice} from "@src/redux/progress/unlocks/BoardStylePrice";

/**
 * The board the game is drawn on. A preference rather than part of the game, so a choice is worn at once
 * and never deals another position.
 *
 * Built-ins that cost more XP than the player has earned stay in the list with what opens them. The
 * player's own boards follow the built-ins and are never locked.
 */
export function BoardSetting(): React.JSX.Element {
  const xp = useAppSelector(state => state.progress.xp);
  const boards = useAppSelector(state => state.customStyles.boards);
  const {boardStyle} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <OptionPicker
      id="board-style"
      label="Board"
      options={[...BUILT_IN_STYLES, ...boards]}
      selected={boardStyle}
      lockedReason={style => lockBehindXp(boardStylePrice(style.name), xp)}
      onSelect={style => dispatch(boardStyleChosen(style.name))}
    />
  );
}
