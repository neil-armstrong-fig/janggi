import {Button} from "@src/react/pages/game/components/button/Button";
import {joinFriendRoom} from "@src/redux/online/actions/entering/JoinFriendRoom";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useIntroduction} from "@src/react/pages/game/hooks/use-introduction/UseIntroduction";
import {useState} from "react";

/** Type the code a friend gave, in any case and with or without a hyphen between its halves. */
export function EnterCode(): React.JSX.Element {
  const [typed, setTyped] = useState("");
  const refused = useAppSelector(state => state.friend.joinRefused);
  const introduction = useIntroduction();
  const dispatch = useAppDispatch();

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={event => {
        event.preventDefault();
        dispatch(joinFriendRoom(typed, introduction));
      }}
    >
      <p className="text-xs font-medium text-white/60">Enter a code</p>

      <div className="flex gap-2">
        <input
          data-testid="friend-code-input"
          aria-label="Your friend's code"
          value={typed}
          onChange={event => setTyped(event.target.value)}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/20 bg-black/20 px-3 font-mono text-base tracking-widest text-white uppercase"
        />

        <Button variant="primary" type="submit" data-testid="friend-join">
          Join
        </Button>
      </div>

      <p role="status" data-testid="friend-join-message" data-refused={refused} className="min-h-4 text-xs text-danger">
        {refused && "There is no game with that code. Check it with your friend."}
      </p>
    </form>
  );
}
