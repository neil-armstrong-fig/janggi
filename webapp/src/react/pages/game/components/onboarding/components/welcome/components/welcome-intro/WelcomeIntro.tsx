import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly onContinue: () => void;
}

/** The welcome's first screen: what Janggi is, in three short lines. */
export function WelcomeIntro({onContinue}: Props): React.JSX.Element {
  const {welcome} = useMessages();

  return (
    <>
      <h2
        id="welcome-title"
        tabIndex={-1}
        autoFocus
        className="text-lg font-semibold tracking-wide text-wood outline-none"
      >
        {welcome.title}
      </h2>

      <p className="text-sm text-white/80">{welcome.aboutTheGame}</p>

      <p className="text-sm text-white/80">{welcome.aboutThisDevice}</p>

      <button
        type="button"
        data-testid="welcome-next"
        onClick={onContinue}
        className="cursor-pointer rounded-lg bg-gold px-4 py-3 font-semibold text-ink"
      >
        {welcome.next}
      </button>
    </>
  );
}
