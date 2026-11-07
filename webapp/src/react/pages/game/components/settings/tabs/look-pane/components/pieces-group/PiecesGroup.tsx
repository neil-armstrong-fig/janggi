import {useAppSelector} from "@src/redux/Hooks";
import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {PieceSetSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/pieces-group/components/piece-set-setting/PieceSetSetting";
import {useOwnPreferences} from "@src/react/pages/game/hooks/use-own-preferences/UseOwnPreferences";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function PiecesGroup({open, onToggle}: Props): React.JSX.Element {
  const {armyPieceSets} = useOwnPreferences();
  const {look} = useMessages();
  const split = useAppSelector(state => state.preferences.hanPieceSet !== undefined);
  const cho = armyPieceSets.cho.name;
  const han = armyPieceSets.han.name;

  return (
    <SettingsGroup
      name="Pieces"
      label={look.pieces}
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
      <PieceSetSetting />
    </SettingsGroup>
  );
}
