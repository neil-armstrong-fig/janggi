import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function RobotIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <rect x="4" y="8" width="16" height="11" rx="2.5" />

      <path d="M12 8V4.5M9 13v.5M15 13v.5" />
    </SvgIcon>
  );
}
