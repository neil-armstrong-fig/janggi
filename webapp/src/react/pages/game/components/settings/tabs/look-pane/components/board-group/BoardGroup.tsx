import {useAppSelector} from "@src/redux/Hooks";
import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {BoardSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/board-group/components/board-setting/BoardSetting";
import {useOwnPreferences} from "@src/react/pages/game/hooks/use-own-preferences/UseOwnPreferences";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function BoardGroup({open, onToggle}: Props): React.JSX.Element {
  const {armyBoardStyles} = useOwnPreferences();
  const {look} = useMessages();
  const split = useAppSelector(state => state.preferences.hanBoardStyle !== undefined);
  const cho = armyBoardStyles.cho.name;
  const han = armyBoardStyles.han.name;

  return (
    <SettingsGroup
      name="Board"
      label={look.board}
      summary={
        <span className="flex flex-col items-end">
          <span>
            {split && <span aria-hidden className="mr-1.5 inline-block h-2 w-2 rounded-full bg-cho" />}
            {cho}
          </span>

          {split && (
            <span>
              <span aria-hidden className="mr-1.5 inline-block h-2 w-2 rounded-full bg-han" />
              {han}
            </span>
          )}
        </span>
      }
      open={open}
      onToggle={onToggle}
    >
      <BoardSetting />
    </SettingsGroup>
  );
}
