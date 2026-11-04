import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

export function LegalLinks(): React.JSX.Element {
  const {legal} = useMessages().you.account;

  return (
    <p className="text-xs leading-relaxed text-white/60">
      {legal.start}
      <a
        data-testid="terms-open"
        href={`${import.meta.env.BASE_URL}terms.html`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/30 underline-offset-2 hover:text-white/80"
      >
        {legal.firstLink}
      </a>
      {legal.middle}
      <a
        data-testid="privacy-open"
        href={`${import.meta.env.BASE_URL}privacy.html`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/30 underline-offset-2 hover:text-white/80"
      >
        {legal.secondLink}
      </a>
      {legal.end}
    </p>
  );
}
