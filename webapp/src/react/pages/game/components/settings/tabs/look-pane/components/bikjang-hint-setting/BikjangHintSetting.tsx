import {BIKJANG_HINTS} from "@src/react/pages/game/utils/BikjangHints";
import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {bikjangHintChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * Whether a move that would leave the opponent a bikjang to call is labelled on the board.
 *
 * A preference, worn the moment it is chosen — but turning it on does not make the label appear
 * against every opponent, which the line beneath it says. It answers even in a game where the label is
 * not offered, so a player can set it before choosing a bot. The rule for where it is offered is
 * `bikjangHintShown`; what counts as a move that leaves a bikjang to call is `canCallBikjangAfter`.
 */
export function BikjangHintSetting(): React.JSX.Element {
  const {bikjangHint} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-0.5">
      <Switch
        testId="bikjang-hint-toggle"
        on={bikjangHint.shown}
        label="Label moves that allow a bikjang"
        onToggle={() => {
          const other = BIKJANG_HINTS.find(option => option.shown !== bikjangHint.shown);
          if (other) dispatch(bikjangHintChosen(other.name));
        }}
      />

      <p className="px-2 text-xs text-white/40">
        Writes 빅장 on a move that would leave the generals facing each other. Offered against a person at the same
        device and the 800 and 1000 bots only.
      </p>
    </div>
  );
}
