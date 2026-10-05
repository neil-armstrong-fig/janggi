import {clsx} from "clsx";
import {useRef} from "react";
import {useScrolledToTop} from "@src/react/pages/game/hooks/use-scrolled-to-top/UseScrolledToTop";
import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";

/**
 * The bottom sheet the Record, Play a friend and Styles sheets share: a backdrop, a panel that slides up,
 * and a header with the title and the way to close it. Kept mounted and made `inert` while closed, so
 * the slide has somewhere to come from. The caller decides how tall the panel may grow, and draws what
 * is inside it.
 */
interface Props {
  readonly testId: string;
  readonly closeTestId: string;
  readonly backTestId?: string;
  readonly title: string;
  /** What Close is called for a screen reader, written out whole so it can be said in any language. */
  readonly closeLabel: string;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onBack?: () => void;
  readonly showBack?: boolean;
  readonly className: string;
  readonly children: React.ReactNode;
}

export function Sheet({
  testId,
  closeTestId,
  backTestId,
  title,
  closeLabel,
  open,
  onClose,
  onBack,
  showBack = true,
  className,
  children,
}: Props): React.JSX.Element {
  const panelRef = useRef<HTMLElement>(null);
  useScrolledToTop(panelRef, open);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 motion-reduce:transition-none",
          open && "opacity-100",
          !open && "pointer-events-none opacity-0",
        )}
      />

      <section
        ref={panelRef}
        data-testid={testId}
        role="dialog"
        aria-label={title}
        aria-modal={open}
        inert={!open}
        className={clsx(
          "fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-lg flex-col rounded-t-2xl bg-ground-raised transition-transform duration-300 ease-out select-none motion-reduce:transition-none",
          className,
          open && "translate-y-0 shadow-2xl shadow-black",
          !open && "translate-y-full",
        )}
      >
        <header className="flex shrink-0 items-center justify-between px-4 pt-3 pb-1">
          <div className="flex min-w-0 items-center gap-2">
            {showBack && onBack !== undefined && backTestId !== undefined && (
              <button
                type="button"
                data-testid={backTestId}
                aria-label="Back"
                onClick={onBack}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10"
              >
                <SvgIcon>
                  <path d="M15 6l-6 6 6 6" />
                </SvgIcon>
              </button>
            )}

            <h2 className="truncate text-sm font-semibold tracking-wide text-wood uppercase">{title}</h2>
          </div>

          <button
            type="button"
            data-testid={closeTestId}
            aria-label={closeLabel}
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            <SvgIcon>
              <path d="M6 6l12 12M18 6 6 18" />
            </SvgIcon>
          </button>
        </header>

        {children}
      </section>
    </>
  );
}
