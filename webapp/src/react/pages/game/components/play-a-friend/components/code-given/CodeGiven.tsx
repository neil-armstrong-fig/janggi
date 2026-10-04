import {formatFriendCode} from "@janggi/shared/janggi/online/friend-code/FormatFriendCode";
import {joinLinkFor} from "@janggi/shared/janggi/online/friend-code/JoinLink";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";
import {useState} from "react";

interface Props {
  readonly code: string;
}

/** The code to give a friend — read out in two halves — with a way to copy it, and a link that takes them straight in. */
export function CodeGiven({code}: Props): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const friendCode = parseFriendCode(code);
  const link =
    friendCode === undefined
      ? undefined
      : joinLinkFor(`${globalThis.location.origin}${import.meta.env.BASE_URL}`, friendCode);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-white/60">Your code</p>

      <p data-testid="friend-code" data-code={code} className="font-mono text-3xl font-bold tracking-widest text-gold">
        {friendCode === undefined ? code : formatFriendCode(friendCode)}
      </p>

      {link !== undefined && (
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(link).then(() => setCopied(true));
          }}
          className="min-h-11 cursor-pointer self-start rounded-lg border border-white/20 px-3 text-sm text-white/80 hover:bg-white/10"
        >
          {copied ? "Link copied" : "Copy a link to send"}
        </button>
      )}
    </div>
  );
}
