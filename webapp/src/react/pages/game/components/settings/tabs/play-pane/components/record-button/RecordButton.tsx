import {Button} from "@src/react/pages/game/components/button/Button";
import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/** Opens the player's record against the bot — their rating in each format and every game behind it. */
export function RecordButton(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {record} = useMessages();

  return (
    <Button
      variant="secondary"
      data-testid="record-open"
      onClick={() => dispatch(sheetOpened("record"))}
      className="shrink-0 self-start"
    >
      {record.title}
    </Button>
  );
}
