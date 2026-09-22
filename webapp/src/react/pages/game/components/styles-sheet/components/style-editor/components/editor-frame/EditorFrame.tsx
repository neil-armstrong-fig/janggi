/**
 * What every style being made is laid out in, whichever kind.
 *
 * **On a phone** the header and the preview stay at the top while the controls scroll beneath them — the
 * preview has to stay in sight for the controls to be worth turning. **On a desktop** there is room for both
 * at once: the header, preview and what is beneath it on the left, kept in view, and the controls on the
 * right in a column of their own that scrolls by itself. The preview takes whatever height the left is left.
 *
 * Layout only: what goes in each part is the editor's to say, so the two kinds of style share it.
 */
interface Props {
  /** Back, the name and save. */
  readonly header: React.ReactNode;
  readonly preview: React.ReactNode;
  /** Whatever goes between the preview and the controls on a phone, and beneath the preview on a desktop. */
  readonly beneathPreview: React.ReactNode;
  /** The controls, or the raw JSON, and the ways to start over. */
  readonly editingPanel: React.ReactNode;
}

export function EditorFrame({header, preview, beneathPreview, editingPanel}: Props): React.JSX.Element {
  return (
    <div data-testid="style-editor" className="flex min-h-0 flex-1 flex-col lg:flex-row lg:gap-6 lg:px-4 lg:pb-4">
      <div className="flex shrink-0 flex-col gap-2 px-4 pb-2 lg:min-h-0 lg:w-[45%] lg:px-0 lg:pb-0">
        {header}

        <div className="h-[34dvh] w-full shrink-0 lg:h-auto lg:min-h-0 lg:flex-1">{preview}</div>

        {beneathPreview}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] lg:px-0 lg:pt-0 lg:pb-0">
        {editingPanel}
      </div>
    </div>
  );
}
