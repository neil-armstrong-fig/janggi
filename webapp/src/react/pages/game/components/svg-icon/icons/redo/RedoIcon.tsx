import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function RedoIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <path d="m15 14 5-5-5-5" />

      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </SvgIcon>
  );
}
