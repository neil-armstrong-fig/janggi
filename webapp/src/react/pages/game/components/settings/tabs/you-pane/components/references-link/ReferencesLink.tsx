import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {useReferencesAddress} from "@src/react/pages/game/hooks/use-references-address/UseReferencesAddress";

export function ReferencesLink(): React.JSX.Element {
  const referencesAddress = useReferencesAddress();
  const {you} = useMessages();

  return (
    <a
      data-testid="references-open"
      href={referencesAddress}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10"
    >
      <span>{you.links.references.title}</span>

      <span className="text-xs text-wood/70">{you.links.references.note}</span>
    </a>
  );
}
