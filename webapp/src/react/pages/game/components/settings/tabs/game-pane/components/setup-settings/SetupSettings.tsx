import {ArmySwitch} from "@src/react/pages/game/components/settings/tabs/game-pane/components/setup-settings/components/army-switch/ArmySwitch";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SetupSetting} from "@src/react/pages/game/components/settings/tabs/game-pane/components/setup-settings/components/setup-setting/SetupSetting";
import {canPlace} from "@src/game/setups/CanPlace";
import {useAppSelector} from "@src/redux/Hooks";
import {useState} from "react";

/**
 * Both armies' opening setups, in one place in the sheet: a Han | Cho switch over the grid of the army
 * it names.
 *
 * Two grids of five would not fit a phone's sheet beside everything else on the Game tab, and the
 * board behind it is the point of choosing — each press lays the army out again where it can be seen.
 * So only one grid shows at a time. **Both stay in the page**, the other only hidden, so each army's
 * chosen setup and whether it may still be chosen are read the same whichever is showing.
 *
 * **It starts on the army whose turn it is to lay out** — Han's, and in a scored game Cho's once Han
 * has chosen, since Cho answers Han's arrangement (`canPlace`). A player who presses the switch is
 * shown what they asked for, until the game moves on to the other army and the switch follows.
 */
export function SetupSettings(): React.JSX.Element {
  const phase = useAppSelector(state => state.game.phase);
  const nextToLayOut: Side = canPlace(phase, "han") ? "han" : "cho";
  const [asked, setAsked] = useState<Side | undefined>(undefined);
  const [followed, setFollowed] = useState<Side>(nextToLayOut);

  if (followed !== nextToLayOut) {
    setFollowed(nextToLayOut);
    setAsked(undefined);
  }

  const showing = asked ?? nextToLayOut;

  return (
    <div className="flex flex-col gap-2">
      <ArmySwitch showing={showing} onShow={setAsked} />

      <div hidden={showing !== "han"}>
        <SetupSetting side="han" />
      </div>

      <div hidden={showing !== "cho"}>
        <SetupSetting side="cho" />
      </div>
    </div>
  );
}
