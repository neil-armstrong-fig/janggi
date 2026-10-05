import {BikjangHintSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/bikjang-hint-setting/BikjangHintSetting";
import {EffectsSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/effects-setting/EffectsSetting";
import {MovableHighlightSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/movable-highlight-setting/MovableHighlightSetting";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * What the board does besides sit there — marks, labels and motion — as three switches under one
 * heading, rather than three pickers of two buttons each.
 */
export function BoardHints(): React.JSX.Element {
  const {look} = useMessages();

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-white/60">{look.onTheBoard}</p>

      <MovableHighlightSetting />

      <BikjangHintSetting />

      <EffectsSetting />
    </div>
  );
}
