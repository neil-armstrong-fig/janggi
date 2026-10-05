import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function FacingIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <circle cx="12" cy="5" r="2.5" />

      <circle cx="12" cy="19" r="2.5" />

      <path d="M12 8.5v7" />
    </SvgIcon>
  );
}
