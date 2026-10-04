import {Button} from "@src/react/pages/game/components/button/Button";
import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch} from "@src/redux/Hooks";

/** Opens the player's record against the bot — their rating in each format and every game behind it. */
export function RecordButton(): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="secondary"
      data-testid="record-open"
      onClick={() => dispatch(sheetOpened("record"))}
      className="shrink-0 self-start"
    >
      Your record
    </Button>
  );
}
