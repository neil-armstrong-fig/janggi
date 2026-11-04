import {useGuideAddress} from "@src/react/pages/game/hooks/use-guide-address/UseGuideAddress";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

export function GuideLink(): React.JSX.Element {
  const guideAddress = useGuideAddress();
  const {you} = useMessages();

  return (
    <a
      data-testid="guide-open"
      href={guideAddress}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10"
    >
      <span>{you.links.guide.title}</span>

      <span className="text-xs text-wood/70">{you.links.guide.note}</span>
    </a>
  );
}
