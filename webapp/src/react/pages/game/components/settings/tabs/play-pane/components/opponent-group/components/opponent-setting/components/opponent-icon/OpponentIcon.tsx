import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import {PersonIcon} from "@src/react/pages/game/components/svg-icon/icons/person/PersonIcon";
import {RobotIcon} from "@src/react/pages/game/components/svg-icon/icons/robot/RobotIcon";

/** A head and shoulders for someone at the same device, and a robot's head for the bot. */
interface Props {
  readonly name: OpponentName;
}

export function OpponentIcon({name}: Props): React.JSX.Element {
  return GLYPHS[name];
}

const GLYPHS: Record<OpponentName, React.JSX.Element> = {
  Human: <PersonIcon className="h-4 w-4" />,
  Bot: <RobotIcon className="h-4 w-4" />,
};
