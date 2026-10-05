import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function ClipboardIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <rect x="6" y="5" width="12" height="16" rx="2" />

      <path d="M9 5.5V4h6v1.5M9.5 12h5M9.5 16h5" />
    </SvgIcon>
  );
}
