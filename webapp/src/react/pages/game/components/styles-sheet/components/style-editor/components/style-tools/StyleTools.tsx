import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {SelectField} from "@src/react/pages/game/components/select-field/SelectField";
import {COPY_SCOPES} from "@janggi/shared/janggi/styles/CopyScope";
import type {CopyScope} from "@janggi/shared/janggi/styles/CopyScope";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {PasteKey} from "@src/react/pages/game/components/paste-key/PasteKey";
import {useState} from "react";

/**
 * The ways to start a style over without leaving it: put back the style it was started from, load one the
 * player has, or load one somebody shared as a key. Folded away, since they are used once in a while and
 * the controls are what the editor is for.
 *
 * What a key or a copied style is loaded *into* is the editor's to decide — this only asks for it. A set of
 * pieces may be copied whole, or one army's pieces only, since Han and Cho can be dressed differently.
 */
interface Props {
  /** The name of the style the editor was opened on, which Reset goes back to. */
  readonly startName: string;
  readonly onReset: () => void;
  readonly onPasteKey: (text: string) => PasteResult;
  /** The names of the styles the player has, which one may be copied from. */
  readonly sources: readonly string[];
  readonly onCopy: (name: string, copyScope: CopyScope) => void;
  /** Whether what is made has two armies, and so a copy may be of one of them. */
  readonly byArmy: boolean;
}

export function StyleTools({startName, onReset, onPasteKey, sources, onCopy, byArmy}: Props): React.JSX.Element {
  const words = useMessages().styles.tools;
  const [from, setFrom] = useState("");
  const [scope, setScope] = useState<CopyScope>("both");

  return (
    <details data-testid="style-editor-tools" className="rounded-xl bg-black/15 px-3 py-2">
      <summary className="cursor-pointer text-xs font-semibold tracking-wide text-white/60 uppercase">
        {words.summary}
      </summary>

      <div className="flex flex-col gap-3 pt-3">
        <button
          type="button"
          data-testid="style-editor-reset"
          onClick={onReset}
          className="h-10 cursor-pointer rounded-xl bg-danger/20 text-sm text-danger hover:bg-danger/30"
        >
          {words.resetTo(startName)}
        </button>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-white/60">{words.loadOneYouHave}</span>

          <div className="flex gap-2">
            <SelectField
              wrapperClassName="min-w-0 flex-1"
              data-testid="style-editor-copy-from"
              aria-label={words.styleToLoad}
              value={from || sources[0]}
              onChange={event => setFrom(event.target.value)}
              className="h-10 text-sm"
            >
              {sources.map(name => (
                <option key={name} value={name} className="bg-ground-raised">
                  {name}
                </option>
              ))}
            </SelectField>

            {byArmy && (
              <SelectField
                wrapperClassName="w-28 shrink-0"
                data-testid="style-editor-copy-scope"
                aria-label={words.howMuch}
                value={scope}
                onChange={event => setScope(COPY_SCOPES.find(option => option === event.target.value) ?? "both")}
                className="h-10 text-sm"
              >
                {COPY_SCOPES.map(option => (
                  <option key={option} value={option} className="bg-ground-raised">
                    {words.scopes[option]}
                  </option>
                ))}
              </SelectField>
            )}
          </div>

          <button
            type="button"
            data-testid="style-editor-copy"
            onClick={() => onCopy(from || (sources[0] ?? ""), scope)}
            className="h-10 cursor-pointer rounded-xl bg-white/10 text-sm font-semibold text-white/80 hover:bg-white/15"
          >
            {words.load}
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-white/60">{words.loadFromKey}</span>

          <PasteKey
            id="style-editor-import"
            label={words.loadKey}
            placeholder={words.keyPlaceholder}
            onSubmit={onPasteKey}
          />
        </div>
      </div>
    </details>
  );
}
