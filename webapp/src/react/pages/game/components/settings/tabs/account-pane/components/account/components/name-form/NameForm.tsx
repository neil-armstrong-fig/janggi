import {Button} from "@src/react/pages/game/components/button/Button";
import type {RenameResult} from "@src/redux/account/types/RenameResult";
import {clsx} from "clsx";
import {renameAccount} from "@src/redux/account/actions/RenameAccount";
import {useAppDispatch} from "@src/redux/Hooks";
import {useState} from "react";

/**
 * A box to type a new display name into, and a button to save it, with a line under them saying what came of it.
 * The text is 16px because iOS zooms the page into any form field smaller than that when it is focused.
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
      <span className="text-xs font-medium text-white/60">Display name</span>

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

        <Button variant="secondary" data-testid="account-name-save" onClick={() => void save()} className="shrink-0">
          Save
        </Button>
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
