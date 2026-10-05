import clsx from "clsx";
import {ChevronDownIcon} from "@src/react/pages/game/components/svg-icon/icons/chevron-down/ChevronDownIcon";

interface Props extends React.ComponentProps<"select"> {
  wrapperClassName?: string;
}

/**
 * A native select drawn square. The open list takes the select's own corner radius in Chrome and
 * Android, so a rounded field gives a rounded, bordered list — hence no radius here.
 */
export function SelectField({wrapperClassName, className, disabled, children, ...rest}: Props): React.JSX.Element {
  return (
    <div className={clsx("relative", wrapperClassName)}>
      <select
        {...rest}
        disabled={disabled}
        className={clsx(
          "w-full cursor-pointer appearance-none rounded-none bg-black/25 pr-9 pl-3 text-white/90 disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
      >
        {children}
      </select>

      <ChevronDownIcon
        className={clsx(
          "pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-white/60",
          disabled && "opacity-40",
        )}
      />
    </div>
  );
}
