import {Button} from "@src/react/pages/game/components/button/Button";
import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {useAppDispatch} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/** Opens the player's XP-linked styles — to import, share or make one. */
export function StylesButton(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {look} = useMessages();

  return (
    <Button
      variant="secondary"
      data-testid="styles-open"
      {...tourTarget("styles")}
      onClick={() => dispatch(sheetOpened("styles"))}
    >
      {look.yourStyles}
    </Button>
  );
}
