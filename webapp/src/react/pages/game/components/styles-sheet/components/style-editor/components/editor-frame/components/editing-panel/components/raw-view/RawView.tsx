import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
/**
 * The style as JSON, for whoever wants a value the controls do not offer. What is typed is checked as an
 * imported style is, and what is wrong with it said beneath; only text that is a style reaches the preview.
 */
interface Props {
  readonly raw: string;
  /** What is wrong with the text, if it is not a style. */
  readonly rawRefusal: string | undefined;
  readonly onRaw: (text: string) => void;
}

export function RawView({raw, rawRefusal, onRaw}: Props): React.JSX.Element {
  const words = useMessages().styles.editor;
  return (
    <>
      <textarea
        data-testid="style-editor-json"
        aria-label={words.rawLabel}
        value={raw}
        rows={14}
        spellCheck={false}
        onChange={event => onRaw(event.target.value)}
        className="w-full shrink-0 rounded-xl bg-black/25 px-3 py-2 font-mono text-base leading-snug text-white/90"
      />

      {rawRefusal && (
        <p data-testid="style-editor-raw-message" role="status" className="text-xs break-words text-danger">
          {rawRefusal}
        </p>
      )}
    </>
  );
}
