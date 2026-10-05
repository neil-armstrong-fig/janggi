import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function EyeIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />

      <circle cx="12" cy="12" r="2.8" />
    </SvgIcon>
  );
}
