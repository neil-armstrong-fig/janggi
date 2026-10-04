import {clsx} from "clsx";

/**
 * The three buttons a sheet or a settings tab is made of. `primary` is the one thing to do, `secondary`
 * a quieter action beside it, `outline` a row that leads somewhere. What a caller adds is where the button
 * sits (`self-start`, `flex-1`) or how its row is laid out, never its colour, height or corners.
 *
 * A button that must look different (the gold and danger ones) is not one of these, and stays as it is.
 */
interface Props extends Omit<React.ComponentProps<"button">, "type"> {
  readonly variant: ButtonVariant;
  readonly type?: "button" | "submit";
}

type ButtonVariant = "primary" | "secondary" | "outline";

const ACTION =
  "h-11 shrink-0 cursor-pointer rounded-xl px-4 text-sm font-semibold tracking-wide uppercase transition-[transform,background-color] duration-150 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none";

export function Button({variant, type = "button", className, ...rest}: Props): React.JSX.Element {
  return (
    <button
      {...rest}
      type={type}
      className={clsx(
        variant === "primary" && [ACTION, "bg-wood text-ink shadow enabled:hover:bg-wood/90"],
        variant === "secondary" && [ACTION, "bg-black/25 text-white/80 enabled:hover:bg-black/35"],
        variant === "outline" &&
          "flex min-h-11 cursor-pointer rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10",
        className,
      )}
    />
  );
}
