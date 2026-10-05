import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function SlidersIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <path d="M4 7h9M19 7h1M4 17h3M13 17h7" />

      <circle cx="16" cy="7" r="2.5" />

      <circle cx="10" cy="17" r="2.5" />
    </SvgIcon>
  );
}
