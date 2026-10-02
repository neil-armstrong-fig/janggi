import type {RenameResult} from "@src/redux/account/types/RenameResult";
import {clsx} from "clsx";
import {renameAccount} from "@src/redux/account/actions/RenameAccount";
import {useAppDispatch} from "@src/redux/Hooks";
import {useState} from "react";

/**
 * A box to type a new display name into, and a button to save it, with a line under them saying what came of it.
 *
 * No `maxLength` on the box: a name too long is refused with the reason, which is what the player needs to hear,
 * where a box that quietly stopped taking letters would only look broken. The text is 16px because iOS zooms the
 * page into any form field smaller than that when it is focused.
 */
export function NameForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [result, setResult] = useState<RenameResult | undefined>(undefined);

  const save = async (): Promise<void> => {
    const renamed = await dispatch(renameAccount(text));

    setResult(renamed);
    if (renamed.accepted) setText("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          data-testid="account-name-input"
          aria-label="Display name"
          placeholder="Change your display name"
          value={text}
          autoComplete="off"
          spellCheck={false}
          onChange={event => {
            setText(event.target.value);
            setResult(undefined);
          }}
          className="min-w-0 flex-1 rounded-xl bg-black/25 px-3 py-2 text-base text-white/90 select-text placeholder:text-white/30"
        />

        <button
          type="button"
          data-testid="account-name-save"
          onClick={() => void save()}
          className="h-11 shrink-0 cursor-pointer rounded-xl bg-black/25 px-4 text-sm font-semibold tracking-wide text-white/80 uppercase hover:bg-black/35"
        >
          Save
        </button>
      </div>

      {result && (
        <p
          data-testid="account-name-message"
          data-accepted={result.accepted}
          role="status"
          className={clsx("text-xs break-words", result.accepted && "text-cho", !result.accepted && "text-danger")}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
