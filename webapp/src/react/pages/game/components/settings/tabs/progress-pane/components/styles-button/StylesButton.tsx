import {Button} from "@src/react/pages/game/components/button/Button";
import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {useAppDispatch} from "@src/redux/Hooks";

/** Opens the player's XP-linked styles — to import, share or make one. */
export function StylesButton(): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="secondary"
      data-testid="styles-open"
      {...tourTarget("styles")}
      onClick={() => dispatch(sheetOpened("styles"))}
    >
      Your styles
    </Button>
  );
}
