import {COPY_SCOPES} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/style-tools/types/CopyScope";
import type {CopyScope} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/style-tools/types/CopyScope";
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
  const [from, setFrom] = useState("");
  const [scope, setScope] = useState<CopyScope>("both");

  return (
    <details data-testid="style-editor-tools" className="rounded-xl bg-black/15 px-3 py-2">
      <summary className="cursor-pointer text-xs font-semibold tracking-wide text-white/60 uppercase">
        Load or reset
      </summary>

      <div className="flex flex-col gap-3 pt-3">
        <button
          type="button"
          data-testid="style-editor-reset"
          onClick={onReset}
          className="h-10 cursor-pointer rounded-xl bg-danger/20 text-sm text-danger hover:bg-danger/30"
        >
          Reset to {startName}
        </button>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-white/60">Load one you have</span>

          <div className="flex gap-2">
            <select
              data-testid="style-editor-copy-from"
              aria-label="The style to load"
              value={from || sources[0]}
              onChange={event => setFrom(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-xl bg-black/25 px-2 text-sm text-white/90"
            >
              {sources.map(name => (
                <option key={name} value={name} className="bg-ground-raised">
                  {name}
                </option>
              ))}
            </select>

            {byArmy && (
              <select
                data-testid="style-editor-copy-scope"
                aria-label="How much of it to load"
                value={scope}
                onChange={event => setScope(COPY_SCOPES.find(option => option === event.target.value) ?? "both")}
                className="h-10 w-28 shrink-0 rounded-xl bg-black/25 px-2 text-sm text-white/90"
              >
                {COPY_SCOPES.map(option => (
                  <option key={option} value={option} className="bg-ground-raised">
                    {SCOPE_NAMES[option]}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            data-testid="style-editor-copy"
            onClick={() => onCopy(from || (sources[0] ?? ""), scope)}
            className="h-10 cursor-pointer rounded-xl bg-white/10 text-sm font-semibold text-white/80 hover:bg-white/15"
          >
            Load
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-white/60">Load from a key somebody shared</span>

          <PasteKey
            id="style-editor-import"
            label="Load key"
            placeholder="Paste a board or piece set key"
            onSubmit={onPasteKey}
          />
        </div>
      </div>
    </details>
  );
}

const SCOPE_NAMES: Record<CopyScope, string> = {both: "Whole set", han: "Han's", cho: "Cho's"};
