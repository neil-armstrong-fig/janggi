import {ElephantPairingLine} from "@src/react/pages/game/components/settings/tabs/play-pane/components/setup-group/components/elephant-pairing-line/ElephantPairingLine";
import {SetupSettings} from "@src/react/pages/game/components/settings/tabs/play-pane/components/setup-group/components/setup-settings/SetupSettings";
import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {useAppSelector} from "@src/redux/Hooks";
import type {PlayMessages} from "@src/language/settings/play-messages/PlayMessages";
import type {Setup} from "@janggi/engine/setups/types/Setup";

/**
 * Both armies' opening setups and the 맞상/엇상 line they come to. Its line gives Cho's setup over Han's, each after its
 * army's colour, in the order of the army switch inside it.
 */
interface Props {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function SetupGroup({open, onToggle}: Props): React.JSX.Element {
  const {choSetup, hanSetup} = useAppSelector(state => state.game.phase);
  const {play} = useMessages();

  return (
    <SettingsGroup
      name="Setup"
      label={play.setup}
      summary={
        <span className="flex flex-col items-end">
          <span>
            <span aria-hidden className="mr-1.5 inline-block h-2 w-2 rounded-full bg-cho" />
            {nameOf(choSetup, play)}
          </span>

          <span>
            <span aria-hidden className="mr-1.5 inline-block h-2 w-2 rounded-full bg-han" />
            {nameOf(hanSetup, play)}
          </span>
        </span>
      }
      open={open}
      onToggle={onToggle}
    >
      <SetupSettings />

      <ElephantPairingLine />
    </SettingsGroup>
  );
}

function nameOf(setup: Setup | undefined, play: PlayMessages): string {
  if (setup === undefined) return play.setupNotChosen;

  return play.setupNames[setup.name];
}
